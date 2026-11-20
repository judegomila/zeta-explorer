# Fixed-grid phase-alias prime-divisor shifted-convolution barrier

## 0. Exact outcome and claim boundary

Put

\[
 h={2\pi\over L},\qquad t_j=jh,\qquad Q=e^L.       \tag{0.1}
\]

For a smooth dyadic weight and the Fourier-compact analytic auxiliary
profile specified in Section 2, this note computes exactly the Poisson
modes `k=0,+1,-1` of

\[
 h\sum_j w(t_j/T)|Z(t_j)|^2
 \sum_\gamma m_\gamma
 \psi\left({t_j-\gamma\over h}\right),
 \qquad \psi(y)=v(y)\sin^2(\pi y).                 \tag{0.2}
\]

The factor `h` in (0.2) is the Poisson normalization: the corresponding
unscaled auxiliary statistic is exactly `h^(-1)` times (0.2).  It must
not be identified with the frozen compact-window `PW1` numerator.  With
the Fourier conventions fixed below, Poisson summation gives

\[
 \mathcal Q_h=\sum_{k\in\mathbb Z}\mathcal C_k,     \tag{0.3}
\]

where `mathcal C_0` is the continuous weighted one-level statistic and
`mathcal C_(+1),mathcal C_(-1)` are distinct fixed-grid data.  The
Guinand--Weil explicit formula gives all signs and constants in those
three modes.  In particular, the resonant part of the combined first
aliases is

\[
 \boxed{
 \mathcal R_1={h\over4\pi}\Re\sum_{q=p^r}
 {\Lambda(q)\over\sqrt q}\,
 \widehat v\left({\log q-L\over L}\right)
 I_T(\log q-L),}                                   \tag{0.4}
\]

where

\[
 I_T(\omega)=\int_{\mathbb R}w(t/T)|Z(t)|^2
 e^{-i\omega t}\,dt.                               \tag{0.5}
\]

Formula (0.4) is a specified sideband component; the archimedean term,
the other sideband components, the frequencies `+-(L+log q)`, and every
`|k|>=2` Poisson mode remain present in the exact formula.  The positive
coefficient in (0.4) does not give positivity because the real part of
`I_T` has no fixed sign.

The admissibility restriction is essential.  The compact physical
microscopic profile used to formulate the frozen `PW1` target is not, in
general, a strip-analytic Guinand--Weil test, and its unregularized prime
series is not an ordinary convergent sum.  This note does not pass from
the analytic auxiliary class to that compact physical profile.  Such a
passage is a separate conditional approximation theorem requiring
uniform control of the zero statistic, the prime side, and the Poisson
aliases.

Expanding (0.5) by a two-piece smoothed approximate functional equation
produces four channels.  Their resonance variables are

\[
 {qm\over Qn},\qquad {qn\over Qm},\qquad
 {qmn\over Q},\qquad {q\over Qmn}.                 \tag{0.6}
\]

Thus the missing fixed-grid input is a
prime-power/divisor shifted-convolution theorem, including both
same-branch terms and both approximate-functional-equation cross terms,
the archimedean alias, and the remaining
Poisson aliases.  It is not a consequence of a continuous Bettin--Fazzari
formula or Gonek's zero-sampled shifted second moment.

Even the diagonal `m=n` is outside known RH prime control at the required
resolution.  On the locked `p=1` progression,

\[
 Q=\lambda^2,\qquad
 T\sim2\pi\lambda L^2,\qquad
 {Q\over T}\sim{\sqrt Q\over2\pi L^2};            \tag{0.7}
\]

on the critical boundary layer `N~D*lambda^2*L`,

\[
 T\sim2\pi DQ,\qquad {Q\over T}\sim{1\over2\pi D}.
                                                               \tag{0.8}
\]

The first scale is below the square-root prime scale by `L^2`; the second
asks for bounded-interval prime information near `Q`.  The RH prime
number theorem has error `O(sqrt(Q)*log^2(Q))` and proves neither.  The
averages over `m,n` might create cancellation, but that is precisely the
new shifted-convolution input rather than a known consequence of RH.

There is one exact positive statement.  If the carrier origin and the
relative phase profile are translated together and the continuous
statistic is positive relative to its continuous Hardy mass, then averaging
over one carrier cell proves that at least one translated lattice has the
same lower bound.  It does not identify the required translation
`theta=0`.  On the adaptive constant-`N` plateau, varying
`L_u=L+u/t`, `0<=u<=2*pi`, scans the edge through one carrier cell with a
uniform `O(1/N)` coordinate defect on every `O(1)` physical edge block,
and changes `lambda` by `1+O(1/t)`.  No uniform theorem here transfers the
global continuous statistic, its Hardy values, or the finite strict gates
through that scan.  Hence this geometry is not promoted to a cofinal
fixed-grid theorem.

This is an unbound post-checkpoint-1.44 theorem/barrier note/test pair.  It
changes no standard eight file and adds no serialized numerical artifact.
It proves no `PW1` estimate on the original grid, no discrete zeta-moment
asymptotic, no short-interval prime theorem, no actual Hardy--Cauchy
transfer, no finite-gate synchronization, no decay of `eta_N^pr`, no new
zeta-zero theorem, no RH implication or converse, and no de
Bruijn--Newman `Lambda` bound.  The formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly three frozen note/test pairs are imported.

| Dependency | SHA-256 |
|---|---|
| notes/ADJACENT_CUTOFF_PHASE_ALIAS_AGGREGATE_REDUCTION_BARRIER.md | 2afaba5a1fca497a6aa28ba1ab41b66736002b1eaece49035059f5c96e0a2a87 |
| tests/test_adjacent_cutoff_phase_alias_aggregate_reduction_barrier.py | d4ea9d9fd2ae5e6ff841f8963932bce56f37a9569ba4a3d918be5879f0757b97 |
| notes/JOINT_HARDY_CAUCHY_PHASE_ENERGY_NONCONCENTRATION_BARRIER.md | 69b985d600f1a9cc5f3522ddaa6a4d4a242e9e3f9907a7deed0abe93e06039d7 |
| tests/test_joint_hardy_cauchy_phase_energy_nonconcentration_barrier.py | 5b38f27de63a5b972a2daec330cfeb895f66a2d7eb691ed6c8691c6e312c51ab |
| notes/ADAPTIVE_EXACT_CARRIER_GEVREY_SCHEDULE_FINITE_GATE_BARRIER.md | ecfb29e9e95bb031b95abb27e2eac97c1f466b84a795335a4645d0a6c9cb668f |
| tests/test_adaptive_exact_carrier_gevrey_schedule_finite_gate_barrier.py | e2ed609e22ec3f81c53c237f9dfd73d972cc0963ad74fd5943222110d192198d |

The adjacent-cutoff pair supplies the exact `PW1` numerator, the profile
normalization, the locked and critical schedules, and the separation
between continuous and discrete statements.  The joint pair supplies the
correct-density obstruction showing that zero density and positivity
alone do not control the Hardy-weighted covariance.  The adaptive pair
supplies the constant-`N` plateau and the finite-gate noninheritance
theorem.  Bettin--Fazzari and Gonek are primary external sources, cited
below but unvendored and nonbinding.  No external statement is imported as
a fixed-grid theorem.

## 2. Guinand--Weil-admissible auxiliary statistic

Assume RH in the arithmetic discussion, and let `gamma` run over all
nontrivial zero ordinates with algebraic multiplicity `m_gamma`.  The
target compact physical zero window would start from a real smooth
function `u` supported away from zero and put

\[
 v_{\rm cpt}(y)={u(y)\over y^2},\qquad
 \psi_{\rm cpt}(y)=v_{\rm cpt}(y)\sin^2(\pi y).     \tag{2.1}
\]

A generic nonzero compact physical `psi_cpt` is not holomorphic in the
strip required by the Guinand--Weil formula.  Merely being Schwartz on
the real axis does not fix this defect, nor does it make the corresponding
raw prime-power series ordinarily convergent.

Accordingly, all exact explicit-formula calculations in this note are
restricted to the following auxiliary class.  Fix `sigma>0`, choose

\[
 \varphi\in C_c^\infty((-\sigma,\sigma)),\qquad
 \varphi(-\xi)=\varphi(\xi)\in\mathbb R,             \tag{2.2}
\]

and define

\[
 v(y)=\int_{\mathbb R}\varphi(\xi)e^{2\pi i y\xi}\,d\xi,
 \qquad \psi(y)=v(y)\sin^2(\pi y).                  \tag{2.3}
\]

Then `v` and `psi` are real even Schwartz functions on the real axis and
extend to entire functions of finite exponential type.  Integration by
parts in (2.3) gives, for every `A,R>0`,

\[
 \sup_{|\Im z|\leq R}(1+|\Re z|)^A
 \{|v(z)|+|\psi(z)|\}<\infty.                       \tag{2.4}
\]

Thus `g_t(z)=psi((t-z)/h)` is holomorphic with rapid horizontal decay in
every fixed strip and is a standard Guinand--Weil test.  Moreover,
`\hat v=varphi`, and the sideband identity below shows

\[
 \operatorname{supp}\widehat\psi
 \subset[-\sigma-1,\sigma+1].                       \tag{2.5}
\]

In particular, the prime-power sum in Section 4 is finite for each
`L`: only `q<=exp((sigma+1)L)` can occur.  There is therefore no hidden
summation prescription or interchange of a conditionally convergent raw
prime series in the exact reduction.

The Fourier transforms are

\[
 \widehat f(\xi)=\int_{\mathbb R}f(y)e^{-2\pi i y\xi}\,dy,
 \qquad
 I_T(\omega)=\int_{\mathbb R}F_T(t)e^{-i\omega t}\,dt,
 \quad F_T(t)=w(t/T)|Z(t)|^2.                       \tag{2.6}
\]

Take `w` real, nonnegative, smooth, and compactly supported in `(1,2)`.
Define

\[
 S_\psi(t)=\sum_\gamma m_\gamma
 \psi\left({t-\gamma\over h}\right),
 \qquad G_T(t)=F_T(t)S_\psi(t).                    \tag{2.7}
\]

At an original carrier `t_j=jh`, with
`y_(j,gamma)=(t_j-gamma)/h`,

\[
 \sin^2(\pi y_{j,\gamma})
 =\sin^2\left({\gamma L\over2}\right).            \tag{2.8}
\]

Consequently (0.2) has exactly the frozen carrier phase and the same
Hardy weighting, but with the analytic auxiliary envelope `v`.  It is
not the compact-window numerator `h*mathcal R_J^ph`.  Passing from this
auxiliary statistic to the target `psi_cpt`, while retaining uniform
control of every arithmetic and Poisson term, is a conditional
approximation problem and is not assumed in this pair.

The elementary sideband identity is exact:

\[
 \boxed{
 \widehat\psi(\xi)={1\over2}\widehat v(\xi)
 -{1\over4}\widehat v(\xi-1)
 -{1\over4}\widehat v(\xi+1).}                    \tag{2.9}
\]

## 3. Exact Poisson modes and translation phases

For `theta in [0,h)`, set

\[
 \mathcal Q_h(\theta)
 =h\sum_{j\in\mathbb Z}G_T(jh+\theta),
 \qquad
 \mathcal C_k=\int_{\mathbb R}G_T(t)e^{-ikLt}\,dt.
                                                               \tag{3.1}
\]

Poisson summation with the conventions (2.6) gives

\[
 \boxed{
 \mathcal Q_h(\theta)=
 \sum_{k\in\mathbb Z}e^{ikL\theta}\mathcal C_k.}  \tag{3.2}
\]

In particular, at the locked origin,

\[
 \mathcal Q_h(0)=\sum_{k\in\mathbb Z}\mathcal C_k.
                                                               \tag{3.3}
\]

Since `G_T` is real,

\[
 \mathcal C_{-k}=\overline{\mathcal C_k}.           \tag{3.4}
\]

Thus the continuous statistic is only `mathcal C_0`; the first correction
on the fixed lattice is `2*Re(mathcal C_1)`.  Positivity of
`mathcal C_0` alone says nothing about its sign.

## 4. Explicit formula with exact signs and normalizations

Apply the Guinand--Weil explicit formula to the admissible entire test
`g_t(x)=psi((t-x)/h)` from Section 2.  Its Fourier transform is

\[
 \widehat g_t(\xi)
 =h e^{-2\pi it\xi}\widehat\psi(-h\xi).             \tag{4.1}
\]

Absorb the gamma-factor, pole, and trivial-zero terms into
`mathcal A_psi(t)`.  The prime-power part is then exactly

\[
 \boxed{
 S_\psi(t)=\mathcal A_\psi(t)
 -{h\over2\pi}\sum_{q=p^r}{\Lambda(q)\over\sqrt q}
 \left\{
 \widehat\psi\left(-{\log q\over L}\right)q^{-it}
 +\widehat\psi\left({\log q\over L}\right)q^{it}
 \right\}.}                                        \tag{4.2}
\]

By (2.5), the displayed prime-power sum is an ordinary finite sum, with
`q<=exp((sigma+1)L)`.  The zero sum is absolutely convergent from the
uniform strip decay in (2.4) and the standard zero-counting bound.
Multiplication by the compactly supported smooth `F_T`, integration in
`t`, and interchange with the finite prime sum are therefore justified.
Put

\[
 \mathcal A_k=\int_{\mathbb R}F_T(t)
 \mathcal A_\psi(t)e^{-ikLt}\,dt.                  \tag{4.3}
\]

Substitution of (4.2) into (3.1) gives every Poisson mode:

\[
 \boxed{
 \mathcal C_k=\mathcal A_k
 -{h\over2\pi}\sum_{q=p^r}{\Lambda(q)\over\sqrt q}
 \left\{
 \widehat\psi\left(-{\log q\over L}\right)
 I_T(\log q+kL)
 +\widehat\psi\left({\log q\over L}\right)
 I_T(kL-\log q)
 \right\}.}                                        \tag{4.4}
\]

In particular, writing `ell_q=log q`,

\[
 \begin{aligned}
 \mathcal C_0={}&\mathcal A_0-{h\over2\pi}\sum_q
 {\Lambda(q)\over\sqrt q}
 \{\widehat\psi(-\ell_q/L)I_T(\ell_q)
 +\widehat\psi(\ell_q/L)I_T(-\ell_q)\},\\
 \mathcal C_{+1}={}&\mathcal A_{+1}-{h\over2\pi}\sum_q
 {\Lambda(q)\over\sqrt q}
 \{\widehat\psi(-\ell_q/L)I_T(L+\ell_q)
 +\widehat\psi(\ell_q/L)I_T(L-\ell_q)\},\\
 \mathcal C_{-1}={}&\mathcal A_{-1}-{h\over2\pi}\sum_q
 {\Lambda(q)\over\sqrt q}
 \{\widehat\psi(-\ell_q/L)I_T(\ell_q-L)
 +\widehat\psi(\ell_q/L)I_T(-L-\ell_q)\}.
 \end{aligned}                                      \tag{4.5}
\]

Equations (4.4)--(4.5) fix both the Poisson sign and the `h/(2*pi)`
normalization.  In particular, the two slowly varying first-alias
frequencies are `ell_q-L` and `L-ell_q`, not `ell_q+L`.

## 5. Exact first-sideband extraction

For `s=ell_q/L`, (2.9) may be written

\[
 \begin{aligned}
 \widehat\psi(-s)&=-{1\over4}\widehat v(1-s)
 +\left\{{1\over2}\widehat v(-s)
 -{1\over4}\widehat v(-1-s)\right\},\\
 \widehat\psi(s)&=-{1\over4}\widehat v(s-1)
 +\left\{{1\over2}\widehat v(s)
 -{1\over4}\widehat v(s+1)\right\}.
 \end{aligned}                                      \tag{5.1}
\]

Select only the displayed first terms in (5.1), in the slowly varying
terms of `mathcal C_(+1)+mathcal C_(-1)` in (4.5).  Their sum is

\[
 \begin{aligned}
 \mathcal R_1={h\over8\pi}\sum_{q=p^r}{\Lambda(q)\over\sqrt q}
 \{&\widehat v(1-\ell_q/L)I_T(\ell_q-L)\\
   +&\widehat v(\ell_q/L-1)I_T(L-\ell_q)\}.
 \end{aligned}                                      \tag{5.2}
\]

For real even `v`, `widehat v` is real even and
`I_T(-omega)=overline(I_T(omega))`; hence (5.2) is exactly (0.4).

The algebraic decomposition itself uses only (2.9), while the exact
Guinand--Weil reduction in this note uses the Fourier-compact class of
Section 2.  If `sigma<1/2`, then in the band
`|ell_q/L-1|<=sigma` the bracketed remainders in (5.1) vanish.  A nonzero
compact physical profile cannot also have compact Fourier support.  Thus
this exact auxiliary identity is not an exact `PW1` theorem for the
frozen compact window.

The remaining terms are not errors by definition.  They include

\[
 \mathcal A_{+1}+\mathcal A_{-1},\qquad
 I_T(L+\ell_q),\qquad I_T(-L-\ell_q),               \tag{5.3}
\]

the bracketed sidebands in (5.1), and all `|k|>=2` terms in (3.3).  A
fixed-grid theorem must estimate their combined contribution rather than
silently discard them.

## 6. Both AFE branches and the missing shifted convolution

Choose a standard smoothed approximate functional equation on the support
of `w` and write

\[
 \zeta\left({1\over2}+it\right)=M_+(t)+\chi(t)M_-(t)+R(t),
                                                               \tag{6.1}
\]

with

\[
 \begin{aligned}
 M_+(t)&=\sum_{m\geq1}{V_+(m,t)\over\sqrt m}\,m^{-it},\\
 M_-(t)&=\sum_{m\geq1}{V_-(m,t)\over\sqrt m}\,m^{it},
 \qquad |\chi(t)|=1.
 \end{aligned}                                      \tag{6.2}
\]

The weights include the usual smooth truncations; the complete remainder
is retained.  For fixed `T` on the compact support of `w`, choose the
standard weights with rapid decay, so the displayed Dirichlet sums are
absolutely and locally uniformly convergent.  Together with the finite
prime sum from Section 4, this justifies the `q,m,n,t` interchanges below;
no raw infinite prime series is rearranged.  Multiplication by the
conjugate gives two same-branch and two cross-branch transforms.  Define

\[
 \begin{aligned}
 \mathcal W^{++}_{m,n}(x)&=\int w(t/T)V_+(m,t)
 \overline{V_+(n,t)}e^{-ixt}\,dt,\\
 \mathcal W^{--}_{m,n}(x)&=\int w(t/T)V_-(m,t)
 \overline{V_-(n,t)}e^{-ixt}\,dt,\\
 \mathcal W^{+-}_{m,n}(x)&=\int w(t/T)\overline{\chi(t)}V_+(m,t)
 \overline{V_-(n,t)}e^{-ixt}\,dt,\\
 \mathcal W^{-+}_{m,n}(x)&=\int w(t/T)\chi(t)V_-(m,t)
 \overline{V_+(n,t)}e^{-ixt}\,dt.
 \end{aligned}                                      \tag{6.3}
\]

Let `widehat mathcal R_T(omega)` denote every term containing at least one
copy of `R`.  Direct expansion, with no asymptotic step, yields

\[
 \begin{aligned}
 I_T(\omega)=\sum_{m,n\geq1}{1\over\sqrt{mn}}
 \{&\mathcal W^{++}_{m,n}(\omega+\log(m/n))
 +\mathcal W^{--}_{m,n}(\omega-\log(m/n))\\
 &+\mathcal W^{+-}_{m,n}(\omega+\log(mn))
 +\mathcal W^{-+}_{m,n}(\omega-\log(mn))\}
 +\widehat{\mathcal R}_T(\omega).
 \end{aligned}                                      \tag{6.4}
\]

Substitute `omega=log(q/Q)` into (6.4).  The complex sum whose real part
occurs in (0.4) is

\[
 \boxed{
 \begin{aligned}
 \mathfrak S_T=\sum_{q=p^r}\sum_{m,n\geq1}
 {\Lambda(q)\over\sqrt{qmn}}
 \widehat v\left({\log q-L\over L}\right)
 \{&\mathcal W^{++}_{m,n}(\log(qm/(Qn)))\\
   +&\mathcal W^{--}_{m,n}(\log(qn/(Qm)))\\
   +&\mathcal W^{+-}_{m,n}(\log(qmn/Q))\\
   +&\mathcal W^{-+}_{m,n}(\log(q/(Qmn)))\}
 +\mathfrak R_T.
 \end{aligned}}                                     \tag{6.5}
\]

Here `mathfrak R_T` is the corresponding prime-weighted AFE remainder.
Equation (6.5) is the declared missing object.  When the slowly varying
weights can be frozen, the first two transforms have the familiar form
`T*widehat w(T*log(ratio))` and localize the ratios to a multiplicative
`1+O(1/T)` window.  The cross transforms contain `chi(t)` and must be
treated with their own stationary phases.  They are not contained in an
assertion about only the first line of (6.5).

The fixed-grid `PW1` route would close if one proved, uniformly on the
admissible schedule, that the combined nonzero Poisson modes are
`o(T*log T)`, or more generally that their lower bound does not cancel the
positive `Theta(T*log T)` continuous main term.  Formula (6.5), together
with (5.3) and the higher aliases, is the precise arithmetic input for
such a theorem.

## 7. Diagonal interval scales and RH-PNT insufficiency

In either same-branch term of (6.5), set `m=n`.  The smooth time transform
then localizes

\[
 |\log(q/Q)|\ll {1\over T},
 \qquad |q-Q|\ll H:={Q\over T}.                    \tag{7.1}
\]

On the original locked progression,

\[
 \lambda=e^{L/2},\qquad Q=\lambda^2,\qquad
 T\sim2\pi\lambda L^2,
 \qquad H\sim{\lambda\over2\pi L^2}
 ={\sqrt Q\over2\pi L^2}.                         \tag{7.2}
\]

The expected prime-power mass and its `q^(-1/2)`-weighted version are

\[
 \sum_{Q<q\leq Q+H}\Lambda(q)\sim H,
 \qquad
 \sum_{Q<q\leq Q+H}{\Lambda(q)\over\sqrt q}
 \sim {1\over2\pi L^2}.                            \tag{7.3}
\]

Under RH, the prime number theorem gives only

\[
 \Psi(x)=x+O(\sqrt x\log^2x),                       \tag{7.4}
\]

so the weighted error at (7.2) is `O(log^2 Q)=O(L^2)`, four powers of
`L` larger than the expected weighted main term in (7.3).

For the critical boundary layer

\[
 N\sim D\lambda^2L,\qquad {1\over2\pi}<D<{1\over2},
 \qquad T\sim2\pi DQ,\qquad H\sim{1\over2\pi D}.
                                                               \tag{7.5}
\]

Now (7.1) asks for von Mangoldt mass in an interval of bounded physical
length near `Q`; after division by `sqrt(Q)` its conjectural size is
`1/(2*pi*D*sqrt(Q))`, while (7.4) still permits an `O(L^2)` error.  RH
does not guarantee a prime or prime power in every such interval.

This is a method barrier, not an impossibility theorem.  The off-diagonal
average over `m,n` in (6.5) may be much better behaved than the isolated
diagonal.  No frozen or cited theorem supplies the uniform four-channel
asymptotic or lower bound required here.

At the locked `p=1` scale, the unphased denominator has its first carrier
frequency beyond the ordinary same-branch Riemann--Siegel ratio band; a
complete denominator estimate must still retain dual, cross, and remainder
terms.  At the critical scale `L=log T+O(1)`, even the denominator lies at
the AFE transition and requires a discrete transition second-moment
theorem.  The critical boundary layer therefore does not bypass the
fixed-grid arithmetic gate.

## 8. Continuous BF/Gonek results remain distinct

Bettin and Fazzari,
[*A weighted one-level density of the non-trivial zeros of the Riemann
zeta-function*](https://arxiv.org/abs/2208.08421), compute a continuous
weighted one-level density for `k=1`.  In the notation of this note, such a
result concerns `mathcal C_0`, subject to its test-function hypotheses.
It does not evaluate `mathcal C_(+1)` or `mathcal C_(-1)` in (4.5).

Under RH, Corollary 2 of Gonek's primary paper,
[*Mean values of the Riemann zeta-function and its derivatives*](https://www.sas.rochester.edu/mth/people/faculty/gonek-steve/assets/pdf/5-mvzdrvs.pdf),
gives the zero-sampled shifted second-moment scale

\[
 \sum_{T\leq\gamma\leq2T}
 \left|\zeta\left({1\over2}+i\left(
 \gamma+{2\pi x\over\log T}\right)\right)\right|^2
 \sim {W_U^1(x)\over2\pi}T(\log T)^2.             \tag{8.1}
\]

That statistic samples shifted values at zeros.  It is not the fixed
progression `t_j=2*pi*j/L`, and it does not compute (6.5).  Unweighted
Montgomery pair correlation likewise does not contain the mixed
prime/divisor/Hardy-value weight.  These continuous or zero-sampled
theorems can motivate the expected positive main term but cannot be
substituted for the missing discrete theorem.

## 9. Exact translated-grid positive theorem

The translation average follows directly from partitioning the real line:

\[
 {1\over h}\int_0^h\mathcal Q_h(\theta)\,d\theta
 =\int_{\mathbb R}G_T(t)\,dt=\mathcal C_0.          \tag{9.1}
\]

Define the translated Hardy mass

\[
 \mathcal D_h(\theta)=h\sum_jF_T(jh+\theta),
 \qquad
 {1\over h}\int_0^h\mathcal D_h(\theta)\,d\theta
 =\int_{\mathbb R}F_T(t)\,dt.                      \tag{9.2}
\]

Therefore, if

\[
 \mathcal C_0\geq\kappa\int_{\mathbb R}F_T(t)\,dt>0,
 \qquad \kappa>0,                                  \tag{9.3}
\]

then there exists `theta in [0,h)` for which

\[
 \boxed{
 \mathcal D_h(\theta)>0,
 \qquad
 \mathcal Q_h(\theta)\geq\kappa\mathcal D_h(\theta).}
                                                               \tag{9.4}
\]

Indeed, nonnegativity of `F_T` implies
`mathcal D_h(theta)=0 => mathcal Q_h(theta)=0`, because then every sampled
factor `F_T(jh+theta)` vanishes.  Otherwise the average of
`mathcal Q_h-kappa*mathcal D_h` would be negative on the positive-mass
set, contradicting (9.1)--(9.3).

The phase is translated with the grid.  At `t=jh+theta`,

\[
 \sin^2\left(\pi{t-\gamma\over h}\right)
 =\sin^2\left({(\gamma-\theta)L\over2}\right).     \tag{9.5}
\]

Thus (9.4) proves existence for a phase-translated profile.  Only
`theta=0` recovers the fixed phase `sin^2(gamma*L/2)` in the frozen
adjacent-cutoff theorem.  Translation averaging kills the aliases after
averaging; it does not show that they are small at the original origin.

## 10. Constant-`N` carrier-cell scan and finite-gate caveat

Let the adaptive frozen theorem provide an exact edge

\[
 t={2\pi(N+1)\over L}.
 \qquad L_u=L+{u\over t},\quad 0\leq u\leq2\pi.     \tag{10.1}
\]

The moved edge is

\[
 t_u={2\pi(N+1)\over L_u}={tL\over L+u/t},
 \qquad
 t_u-t=-{u\over L+u/t}.                             \tag{10.2}
\]

Hence `u in [0,2*pi]` scans from zero to

\[
 -{2\pi\over L+2\pi/t}=-h+O((tL^2)^{-1}).         \tag{10.3}
\]

For the nearby carrier `j=N+1+r`, put
`t_r=2*pi*(N+1+r)/L` and
`t_(r,u)=2*pi*(N+1+r)/L_u`.  The deviation from a common translation is
exactly

\[
 \boxed{
 (t_{r,u}-t_r)-(t_u-t)
 =-{u\over L+u/t}{r\over N+1}.}                    \tag{10.4}
\]

Uniformly for `|r|<=C*L`, (10.4) is `O_C(1/N)`, while

\[
 {\lambda_u\over\lambda}=e^{u/(2t)}=1+O(t^{-1}).   \tag{10.5}
\]

Equations (10.2)--(10.5) prove the carrier-coordinate and scalar-parameter
scan on an `O(1)` physical edge block.  They do not prove a uniform
replacement of `Z(t_(r,u))`, the complete zero profile, or (6.5) by the
rigidly translated arrays in Section 9.  In particular, a global dyadic
Bettin--Fazzari average is not a local `O(1)` plateau theorem.

Even if a future uniform source theorem transfers the favorable
translation to some `u`, the frozen simple-even ground, boundary
normalization, shifted-sector signs, response reserve, and strict
denominator branch are not inherited along the plateau or between
adjacent cutoffs.  A separate synchronization theorem must put the
arithmetic winner and every finite strict gate at the same `L_u,N`.

## 11. Stopping line

For the Fourier-compact analytic auxiliary class of Section 2, the
Poisson and explicit-formula reductions are closed: (4.4)--(4.5) give the
exact `k=0,+1,-1` signs and constants, (5.2) gives the resonant first
sideband, and (6.5) retains all four AFE channels.  The translated-grid
average (9.4) and the local plateau geometry (10.2)--(10.5) are exact.
No exact passage to the compact physical `PW1` profile is claimed.

The arithmetic theorem is not closed.  RH-PNT is already too weak on the
same-branch diagonal, and no cited continuous or zero-sampled result
controls the four-channel fixed-grid shifted convolution.  The earliest
rigorous blocker for `PW1` is therefore the uniform lower bound for the
combined first aliases, with the archimedean, opposite-frequency, AFE
cross, AFE remainder, and higher-Poisson contributions included.  This is
a method barrier; the fixed-grid inequality is neither proved nor
disproved.
