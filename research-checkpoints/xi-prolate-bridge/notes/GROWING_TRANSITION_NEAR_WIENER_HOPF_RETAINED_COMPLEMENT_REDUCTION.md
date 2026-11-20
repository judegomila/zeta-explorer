# Growing-transition near Wiener--Hopf retained-complement reduction

## 0. Exact outcome and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2={p^2\over4},\qquad L=\log A.              \tag{0.1}
\]

This note isolates the first all-outward transition block after exact
divisor regrouping.  It proves the following reductions.

1.  In the exact endpoint-null, full-exterior-metric coordinates, the
    transition block is a finite Wiener--Hopf form.  No diagonal replacement
    of the source metric is made.  If

    \[
      \phi_f(s)={\sqrt\lambda\over2}e^{s/2}
                   \widehat f(\lambda e^s),
    \]

    then

    \[
      Q_{{\rm raw},{\rm near}}(f)
       =2\operatorname {Re}\langle C_1\phi_f,
                                      C_\Lambda\phi_f\rangle. \tag{0.2}
    \]

2.  A collar packet of length `ell` does not see the point multiplier.  It
    sees the exact Fejer-averaged quantity

    \[
    \boxed{
     q_{A,\ell}(\tau)=2\operatorname {Re}
       \sum_{m,n\in(A,2A)}{\Lambda(n)\over\sqrt{mn}}
       e^{i\tau\log(n/m)}
       \left(1-{|\log(n/m)|\over\ell}\right)_+.}       \tag{0.3}
    \]

    Consequently, a negative pointwise trough of the almost-periodic
    multiplier is not a counterdirection.  The required assertion is a
    negative eigenvalue, with margin, of a finite Wiener--Hopf compression.

3.  A smooth negative collar packet can be realized to relative error
    `O(A^(-1))` by an explicit even, endpoint-null, zero-integral log-phase
    source.  The exact normalization is

    \[
     {Q_{{\rm raw},{\rm near}}(f)\over D_{\rm ext}(f)}
      ={\mathfrak w_A[a]\over8\|a\|_2^2}+o(L),          \tag{0.4}
    \]

    where `mathfrak w_A` is the Wiener--Hopf form on the unscaled amplitude
    `a exp(i tau s)`.  The denominator `8` in (0.4) is binding.

4.  Translating a negative packet with spacing greater than
    `ell+log 2` gives an exactly orthogonal direct sum for the isolated near
    block.  One negative mode per cell has asymptotic negative-index density

    \[
       {1\over\ell+\log2}.                              \tag{0.5}
    \]

    Thus it can outrun `Q=floor(C_0 L)` only when
    `C_0<1/(ell+log 2)`.  Arbitrary fixed `C_0` requires a local negative
    index `r` with `r/(ell+log 2)>C_0`; one packet does not suffice.

The unproved input is stated precisely in Section 6.  It is an
unbounded-schedule negative-index theorem in the physical carrier band
`tau=2*pi*A*rho`, `1<rho<2`, after `1/ell` spectral averaging.  Ordinary
PNT discrepancy and the frozen absolute large sieve do not prove it.

The finite calculation in Section 8 is a diagnostic and regression only.
It proves no asymptotic negativity.  The capture discussion in Section 7
is conditional on the stated source-to-physical compatibility.  In
particular, this note does **not** assert a negative direction for the
complete central form.  The pole, Archimedean, reflected, equality, and
moving-divisor blocks may cancel the isolated near block.  No determinant,
zero, RH, or Lambda conclusion follows.  The project state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs and exact spaces

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md` | `ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86` |
| `notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md` | `23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0` |
| `notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md` | `1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032` |
| `tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py` | `e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_ALL_OUTWARD_HARD_TAIL_DIVISOR_REGROUPING_THEOREM.md` | `0f3de001b13125dcb6efe5cd0d9afa5c7a897f47fc732f06aac9f63fa457f50f` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_NEAR_BAND_FOLD_LARGE_SIEVE_THEOREM.md` | `93a42acf8f33a2706e67ca53a929755d021c291a0dd3907099eb3176524e2675` |
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |

Let `C_tr^#` be the complete endpoint-sheared transition/rest source
synthesis.  Its columns are the actual combinations `c_t-alpha_t c_4`;
before the shear the rest metric is

\[
 D_R=D_T+d_4\alpha\alpha^*+d_0bb^*.                    \tag{1.1}
\]

After applying the same shear to the whole synthesis and metric, put

\[
 D_{\rm full}^\#=(C_{\rm tr}^\#)^*D_{\rm ext}C_{\rm tr}^\#. \tag{1.2}
\]

Every transition/rest formula below is a scalar identity for
`f=C_tr^# z`, hence its denominator is exactly `z^*D_full^#z`.  Neither
(1.1) nor (1.2) is replaced by `D_T`.

For the separate low prefix, let `kappa` be the normalized physical anchor.
Inside the plus-phase physical space `H_+`, put

\[
 {\cal K}=H_+\cap\kappa^\perp,\qquad
 N=2^{9600\lambda^2},\qquad R=\sqrt N.                \tag{1.3}
\]

Choose an allowed orthogonal half-power split and the low-prefix range by

\[
 \begin{gathered}
 {\cal K}=Y\oplus F,\qquad
 F\subset {\cal K}_L^\perp\cap\operatorname {ran}P_{>R}^+,\\
 V_Q=W_Q^\#(D_Q^\#)^{-1/2},\qquad
 {\cal K}_Q=\operatorname {ran}V_Q
       \subset {\cal K}_L\subset Y.
 \end{gathered}                                        \tag{1.4}
\]

Only now define

\[
 \boxed{R_Q=Y\ominus{\cal K}_Q.}                      \tag{1.5}
\]

The last orthogonal complement uses the ordinary ambient physical Hilbert metric.
It is not a source-metric orthogonal complement.  In particular, `Y` is the
half-power summand in (1.4), not the whole plus-phase space.

## 2. Exact logarithmic translation form

Use the Fourier convention

\[
 H(t)=\widehat f(t)=\int_{\mathbb R}f(x)e^{2\pi ixt}\,dx,
 \qquad I=[\lambda^{-1},\lambda],
 \qquad (T_kf)(u)=H(ku).                               \tag{2.1}
\]

For an even source, define

\[
 \phi_f(s)={\sqrt\lambda\over2}e^{s/2}H(\lambda e^s),
 \qquad s\geq0.                                       \tag{2.2}
\]

The two exterior Fourier tails give the exact isometry

\[
 \boxed{D_{\rm ext}(f)=8\|\phi_f\|_{L^2(0,\infty)}^2.} \tag{2.3}
\]

Put

\[
 r=\log(\lambda u)\in[0,L],\qquad
 a_k=\log(k/A),                                        \tag{2.4}
\]

and use the target unitary

\[
 (Ug)(r)=\lambda^{-1/2}e^{r/2}
                   g(\lambda^{-1}e^r).                \tag{2.5}
\]

Direct substitution, including every half-density, gives

\[
 \boxed{(UT_kf)(r)=2k^{-1/2}\phi_f(r+a_k).}            \tag{2.6}
\]

Let

\[
 {\cal W}_A=(A,2A)\cap\mathbb Z,
 \qquad (\tau_a h)(r)=h(r+a),                          \tag{2.7}
\]

\[
 C_1=\sum_{k\in{\cal W}_A}k^{-1/2}\tau_{a_k},\qquad
 C_\Lambda=\sum_{k\in{\cal W}_A}
                   \Lambda(k)k^{-1/2}\tau_{a_k}.      \tag{2.8}
\]

The exact divisor identity on this window is

\[
 {\cal P}_A(k)=\Lambda(k),\qquad A<k<2A,              \tag{2.9}
\]

because `k=ln<2A` and `n>A` force `l=1,n=k`.  Therefore

\[
 US_{\rm tr}f=2C_1\phi_f,\qquad
 U(S_{\rm tr}+R_{\rm tr})f=2C_\Lambda\phi_f.          \tag{2.10}
\]

Since

\[
 Q_{{\rm raw},{\rm near}}
 ={1\over4}\{S_{\rm tr}^*(S_{\rm tr}+R_{\rm tr})
             +(S_{\rm tr}+R_{\rm tr})^*S_{\rm tr}\}, \tag{2.11}
\]

(0.2) follows.  Equivalently, expanding `R_tr` gives exactly

\[
 {1\over2}S_{\rm tr}^*S_{\rm tr}
 +{1\over4}\{S_{\rm tr}^*R_{\rm tr}
                         +R_{\rm tr}^*S_{\rm tr}\}.   \tag{2.12}
\]

Completing a square in (2.12) is not a sign-aware solution.  The diagonal
mean of `R_tr^*R_tr` contains

\[
 \sum_{A<k<2A}{(\Lambda(k)-1)^2\over k}\asymp L,      \tag{2.13}
\]

so the resulting negative allowance is naturally of order `L`, not
`o(L)`.

## 3. Point symbol versus finite Wiener--Hopf compression

On the full line the two translation multipliers are

\[
 M_A(\xi)=\sum_{k\in{\cal W}_A}k^{-1/2}e^{i\xi a_k},
 \qquad
 P_A(\xi)=\sum_{k\in{\cal W}_A}
                \Lambda(k)k^{-1/2}e^{i\xi a_k},       \tag{3.1}
\]

and the scalar point symbol is

\[
 q_A(\xi)=2\operatorname {Re}
                    \{\overline{M_A(\xi)}P_A(\xi)\}. \tag{3.2}
\]

Let `a` be supported in an interval whose translates by every
`a_k in (0,log 2)` remain inside `[0,L]`, and put

\[
 h(s)=a(s)e^{i\tau s}.                                 \tag{3.3}
\]

With `hat a(omega)=int a(s)exp(-i omega s) ds`, Plancherel gives the exact
finite Wiener--Hopf identity

\[
 \boxed{
 \mathfrak w_A[a;\tau]
 :=2\operatorname {Re}\langle C_1h,C_\Lambda h\rangle
 ={1\over2\pi}\int_{\mathbb R}
       q_A(\tau+\omega)|\widehat a(\omega)|^2\,d\omega.} \tag{3.4}
\]

For the normalized rectangular amplitude

\[
 a(s)=\ell^{-1/2}{\bf1}_{[s_0,s_0+\ell]}(s),          \tag{3.5}
\]

the overlap of the `m` and `n` translates is

\[
 \left(1-{|a_n-a_m|\over\ell}\right)_+,              \tag{3.6}
\]

which proves (0.3).  Formula (3.4), rather than (3.2), is the correct
Paley--Wiener resolution.  A physical collar of length at most `L` averages
the symbol over frequency width at least a constant multiple of `1/L`.
Thus neither `inf q_A<0` nor an arbitrarily narrow almost-periodic trough
implies a negative compressed eigenvalue.

## 4. Why ordinary PNT discrepancy does not close the form

Write

\[
 E(x)=\psi(x)-x,
\]

and consider the modulated discrepancy row

\[
 D_A(\tau)=\sum_{A<k<2A}(\Lambda(k)-1)
                  k^{-1/2}e^{i\tau\log(k/A)}.          \tag{4.1}
\]

One Stieltjes integration by parts using only a pointwise bound for `E`
gives

\[
 |D_A(\tau)|
 \leq C{1+|\tau|\over\sqrt A}
             \sup_{A\leq x\leq2A}|E(x)|.              \tag{4.2}
\]

The physical fold carriers have `|tau| asymp A`.  At that scale (4.2) is
worse than the trivial estimate both with the classical zero-free-region
PNT error and with the usual pointwise RH error.  Partial summation has
differentiated the phase on the same scale on which cancellation is
needed.

Consequently a PNT remainder without modulation is insufficient.  A proof
must retain the discrete stationary geometry, for example through a
prime Dirichlet-polynomial large-values estimate, an FKS-type stationary estimate,
or an operator-valued Cotlar/large-sieve argument that controls
the **negative index** of (3.4).  The frozen arbitrary-coefficient large
sieve controls the absolute norm and loses this sign information.

## 5. Explicit log-phase source quasimode

Fix

\[
 1+\eta\leq\rho\leq2-\eta,\qquad
 \tau=2\pi A\rho,                                      \tag{5.1}
\]

and let

\[
 a\in C_c^\infty((\log2+\delta,L-\delta)).            \tag{5.2}
\]

For `w=|x|/lambda` and

\[
 s_x=\log(\rho/w),                                     \tag{5.3}
\]

define the even complex source

\[
 f_a^{(0)}(x)=\lambda^{-1/2}w^{-1/2}
            a(s_x)e^{-i\tau\log w}                    \tag{5.4}
\]

on its support, and zero elsewhere.  The support conditions imply

\[
 \lambda^{-1}<|x|<\lambda,\qquad
 f_a^{(0)}(0)=f_a^{(0)}(\lambda)=0.                    \tag{5.5}
\]

For the positive Fourier branch put `y=log w` and then
`v=y-(log rho-s)`.  The phase becomes

\[
 -\tau y+2\pi Ae^sw
 =\tau s-\tau\log\rho+\tau(e^v-v),                    \tag{5.6}
\]

with its unique stationary point at `v=0` and second derivative `tau`.
The negative Fourier branch has phase derivative
`-tau(1+e^v)` and is nonstationary.  Uniform stationary phase therefore
gives

\[
 H_a^{(0)}(\lambda e^s)
 =\lambda^{-1/2}e^{-s/2}a(s)
       e^{i(\tau s+\theta_\rho)}+O_{a,\eta}(A^{-1})
          \lambda^{-1/2}e^{-s/2},                     \tag{5.7}
\]

in every fixed collar Sobolev norm, where

\[
 \theta_\rho=\tau(1-\log\rho)+{\pi\over4}.           \tag{5.8}
\]

Equivalently,

\[
 \boxed{
 \phi_{f_a^{(0)}}(s)={1\over2}a(s)
           e^{i(\tau s+\theta_\rho)}+O_{a,\eta}(A^{-1}).} \tag{5.9}
\]

The integral of (5.4) has no stationary point.  Repeated integration by
parts gives, for every fixed `M`,

\[
 \left|\int_{\mathbb R}f_a^{(0)}\right|
       \leq C_{a,M}\lambda^{1/2}\tau^{-M}.            \tag{5.10}
\]

Choose a fixed even `beta in C_c^infty((-1/2,1/2))` with
`beta(0)=0` and nonzero integral.  A scalar multiple of
`beta(lambda x)` removes (5.10) exactly.  This bump is supported in the
central hole `|x|<1/(2 lambda)` and is invisible to the physical arithmetic
map.  Its exterior defect is `O_M(A^(-M))` after increasing `M`.  Denote the
corrected zero-integral source by `f_a`.

Equations (2.3) and (5.9) give

\[
 D_{\rm ext}(f_a)=2\|a\|_2^2+O_{a,\eta}(A^{-1}).       \tag{5.11}
\]

Using (0.2), the same expansion gives

\[
 Q_{{\rm raw},{\rm near}}(f_a)
       ={1\over4}\mathfrak w_A[a;\tau]+o(L)\|a\|_2^2. \tag{5.12}
\]

Dividing (5.12) by (5.11) proves (0.4).  In particular, the conditional
margin

\[
 \mathfrak w_A[a;\tau]\leq-\varepsilon L\|a\|_2^2    \tag{5.13}
\]

would produce the isolated-source Rayleigh bound

\[
 {Q_{{\rm raw},{\rm near}}(f_a)\over D_{\rm ext}(f_a)}
       \leq-{\varepsilon\over8}L+o(L).                 \tag{5.14}
\]

## 6. The sharp missing negative-index lemma

The following is the precise arithmetic input not proved here.

### Missing lemma 6.1 (physical-band Wiener--Hopf negative index)

There should exist fixed

\[
 \eta,\delta,\ell,\varepsilon>0                       \tag{6.1}
\]

and, on every sufficiently large locked conductor, a carrier

\[
 \tau_A=2\pi A\rho_A,\qquad
 \rho_A\in[1+\eta,2-\eta],                            \tag{6.2}
\]

together with an `r`-dimensional space

\[
 E_A\subset C_c^\infty((0,\ell))                     \tag{6.3}
\]

whose unit ball has uniformly polynomial collar Sobolev norms, such that

\[
 \boxed{
 \mathfrak w_A[a;\tau_A]
       \leq-\varepsilon L\|a\|_2^2
       \quad(a\in E_A).}                              \tag{6.4}
\]

The quantifier is for the actual von Mangoldt weights, not a model weight.
It is an assertion about the compression (3.4), not the point symbol (3.2).

To see the negative-index consequence, choose a spacing

\[
 d>\ell+\log2                                         \tag{6.5}
\]

and translate `E_A` to collars with left endpoints `s_j=s_0+jd` inside
`(log 2+delta,L-delta)`.  Since every output translate has support in

\[
 [s_j-\log2,s_j+\ell],                                \tag{6.6}
\]

different cells have disjoint near-block output.  Hence (6.4) is an exact
orthogonal direct sum, not an almost-orthogonality assertion.  Its dimension
is

\[
 rJ_A,\qquad J_A={L\over d}+O(1).                     \tag{6.7}
\]

For `Q=floor(C_0L)`, it outruns the low prefix precisely when

\[
 {r\over d}>C_0.                                      \tag{6.8}
\]

For `r=1`, letting the harmless separation tend to zero gives only

\[
 C_0<{1\over\ell+\log2}.                              \tag{6.9}
\]

Thus a one-trough calculation cannot treat the theorem's arbitrary fixed
`C_0`.  What is needed for that quantifier is a negative-index density theorem,
not merely one negative eigenvalue.

## 7. Ambient `R_Q` capture and the remaining compatibility

Let

\[
 {\cal A}_\lambda f(u)=\sqrt u
          \sum_{m\leq\lambda/u}f(mu),\qquad
 S_+={I+J\over2},\qquad (Jg)(u)=g(u^{-1}).             \tag{7.1}
\]

The log-phase sources in Section 5 lie in the visible source annulus.  Finite
Mobius inversion recovers such a source from `A_lambda f` with a polynomial
loss.  After the carrier `exp(-i tau log u)` is factored, the envelopes have
polynomial Sobolev norms.  The reflected term has the opposite carrier.
Repeated integration by parts therefore gives

\[
 \|S_+{\cal A}_\lambda f\|
       \geq\lambda^{-O(1)}\|f\|_2                     \tag{7.2}
\]

on every fixed-cell packet family for all sufficiently large `A`.

Equivalently,

\[
 R=\sqrt N=2^{4800\lambda^2}.                         \tag{7.3}
\]

The same polynomial Sobolev control gives, for every fixed `M`,

\[
 \|P_{>R}S_+{\cal A}_\lambda f\|
       \leq C_M A^{C_M}R^{-M}\|f\|_2.                \tag{7.4}
\]

The high-sector inclusion in (1.4) gives the exact projection bound

\[
 \|P_Fx\|\leq\|P_{>R}x\|.                            \tag{7.4a}
\]

Thus the allowed `F`-component costs `o(A^(-M))` relative to the polynomial
lower bound (7.2).  It cannot annihilate the packet family.  First impose
the anchor condition

\[
 \langle S_+{\cal A}_\lambda f,\kappa\rangle=0        \tag{7.5}
\]

which costs at most one dimension and places the physical image

\[
 x=S_+{\cal A}_\lambda f
 \quad\hbox{in}\quad {\cal K}=Y\oplus F.              \tag{7.5a}
\]

Only under this anchor condition is removal of the `F` component exactly
projection into `Y`:

\[
 y=P_Yx=x-P_Fx.                                       \tag{7.5b}
\]

For a vector not already in `mathcal K`, subtracting `P_Fx` alone would not
remove its anchor component and would not justify membership in `Y`.

Orthogonality to `K_Q` costs at most

\[
 \dim {\cal K}_Q\leq Q+1                              \tag{7.5c}
\]

dimensions.  Since `K_Q subset Y`, these constraints may be imposed on
`x` before the `Y` projection: for `v in K_Q`,

\[
 \langle y,v\rangle=\langle P_Yx,v\rangle
                    =\langle x,v\rangle.              \tag{7.5d}
\]

Consequently, if

\[
 rJ_A>Q+2,                                             \tag{7.6}
\]

there is a nonzero packet combination satisfying the anchor and `K_Q`
conditions.  Its projected image `y=P_Yx` lies in the ambient-Hilbert
complement `R_Q`.  Equations (7.2)--(7.4) give
`||y||>=||x||-||P_Fx||>0` for all sufficiently large `A`, so the image is
nonzero.  This is the conditional image/capture step; it does not identify
the packet source with the prescribed finite transition/rest inventory.

There is one final source-compatibility point.  To identify the quadratic
form of the projected image with (5.12), one must lift the exponentially
small correction `-P_F S_+A_lambda f` back to an admissible source.  The
full-source coframe theorem supplies an exact Mobius right inverse with

\[
 \|B_X\|\leq\sqrt2\lambda M_\mu(\lambda)\leq2\sqrt2\lambda^2. \tag{7.7}
\]

For an arbitrary `L^2` correction source `h`, Plancherel gives

\[
 \|T_kh\|_{L^2(I)}\leq k^{-1/2}\|h\|_2,              \tag{7.8}
\]

and hence the transition near form changes by at most a polynomial in `A`
times `\|h\|_2`.  Equations (7.4), (7.7), and (7.8) make this `o(1)`.

However, the frozen coframe theorem is an `L^2` full-source theorem.  It
does not state that the correction lift preserves the prescribed finite
transition/rest inventory or its endpoint trace.  Therefore the conclusion
of this section is deliberately conditional:

\[
 \begin{split}
 &\text{Lemma 6.1, (6.8), and an admissible full-source lift}\\
 &\qquad\Longrightarrow\quad
 \text{one nonzero }y_A\in R_Q\text{ with }
 {Q_{{\rm raw},{\rm near}}(y_A)\over D(y_A)}
 \leq-{\varepsilon L\over8}+o(L).
 \end{split}                                          \tag{7.9}
\]

Here the full-source lift is admitted by closure in the isolated near block.
No such conclusion is asserted for the prescribed finite source inventory
without that compatibility lemma.

This distinguishes ambient `R_Q` capture from transition-tail range
capture.  It also leaves the complete central form untouched.

## 8. Finite diagnostic, not an asymptotic theorem

Take the locked finite conductor

\[
 p=41,\qquad A={1681\over4}=420.25,\qquad
 \rho=1.8124,\qquad \tau=2\pi A\rho,\qquad
 \ell_*=L-\log2-{1\over4}.                            \tag{8.1}
\]

Direct evaluation of the exact finite sum (0.3) gives

\[
 \begin{array}{c|c|c}
 \ell&q_{A,\ell}(\tau)&q_{A,\ell}(\tau)/L\\ \hline
 \ell_*&-4.7581177434&-0.7876\ldots\\
 1&-3.5865271969&-0.5937\ldots\\
 1/2&-2.0355558336&-0.3370\ldots
 \end{array}                                          \tag{8.2}
\]

The first collar has length `L+O(1)` and fits strictly inside the physical
window with fixed endpoint margins.  Thus, at this one finite conductor,
the negative point trough is not washed out by either `1/L` averaging or
the displayed fixed collars.  This is
useful as a normalization regression: it catches the Hermitian factor,
half-density, phase sign, and overlap kernel.  It is not evidence for the quantifier
in Lemma 6.1, and no asymptotic sign is inferred from it.

## 9. Exact status of the analytic attack

The sign-aware reduction has removed two false targets:

1. an absolute `O(lambda polylog(lambda))` estimate, which discards the
   sign and is much too large at the retained-complement scale; and
2. a modal `ell^1` estimate, which discards both the translation geometry
   and the growing negative index.

The surviving arithmetic problem is exactly Lemma 6.1 at the scales

\[
 k\asymp A,\qquad |\tau|\asymp A,\qquad
 \Delta\tau\asymp\ell^{-1},\qquad
 \text{cell separation}>\ell+\log2.                  \tag{9.1}
\]

A proof at one fixed `r` treats only the range (6.9).  A proof for every
fixed prefix constant `C_0` must yield local negative-index density exceeding
`C_0`.  Conversely, a nonnegative lower bound for all compressions (3.4) in
the band (6.2) would rule out this quasimode mechanism even though the global
almost-periodic point symbol has negative troughs.

Neither alternative is presently proved.  The isolated near-block problem
is therefore reduced sharply but not closed.

## 10. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_transition_near_wiener_hopf_retained_complement_reduction -v

The regression checks the frozen inputs, exact Hermitian normalization,
the interval-overlap Wiener--Hopf identity, the finite locked diagnostic,
the `C_0` density threshold, full-metric and ambient-complement scope, ASCII
hygiene, displayed TeX, and every fail-closed claim token.
