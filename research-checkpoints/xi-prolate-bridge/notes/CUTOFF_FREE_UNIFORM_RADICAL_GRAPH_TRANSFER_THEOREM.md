# Cutoff-free uniform radical graph-transfer theorem

Status: post-cp1.64 analytic component theorem.

## 0. Exact outcome and claim boundary

Let `p>=5` be odd and put

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 S=4\lambda^2=p^2,\qquad N=2^{9600\lambda^2}.       \tag{0.1}
\]

Retain the phase-separated leading source `F_m`, its exterior-defect form
`D_m`, and its compact physical radical map `mathcal K_m` from the frozen
weighted-coframe reduction, with `0<=m<=S-1`.  Let `P_N` be the centered
log-Fourier projection and set

\[
 Q_{\lambda,N}=P_NQ_\lambda P_N.                    \tag{0.2}
\]

This note proves the uniform graph transfer that was isolated, but not
claimed, in equation (3.8) of that reduction:

\[
 \boxed{
 \sup_{0\leq m\leq S-1}\ \sup_{0\ne f\in F_m}
 {\|Q_\lambda\mathcal K_mf
       -Q_{\lambda,N}P_N\mathcal K_mf\|
  \over D_m(f)^{1/2}}
 \leq\operatorname {poly}(\lambda,L)e^{-M_{2400}\lambda^2}
 =o(1),}                                                \tag{0.3}
\]

where

\[
 \boxed{
 M_{2400}=4800\log2-{160\pi\log96\over\log2}>0.}     \tag{0.4}
\]

Consequently the exact cutoff-free residual constant of the weighted
coframe reduction satisfies, uniformly for `m<=S-1`,

\[
 \boxed{
 \mathcal C_{F_m}
 \leq\mathcal C^{\rm fin}_{\lambda,m}+o(1)
 =\operatorname {poly}(\lambda,L).}                    \tag{0.5}
\]

Thus the residual-map side of the hard-prefix criterion is closed.  The
remaining condition is the normalized bottom-capture estimate `gamma_m`.
No lower bound for `gamma_m`, bottom-space capture, parity ordering, new
zero statement, converse, or Riemann hypothesis is proved.  The standard
eight and the frozen weighted-coframe pair are not modified.  The formal
state remains `P0_INVALIDATED`.

## 1. Frozen dependencies

No external input is added.  The exact repository bytes used are:

| Dependency | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md` | `c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c` |
| `tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py` | `d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `tests/test_growing_transition_sampling.py` | `ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac` |
| `notes/CUTOFF_FREE_PROLATE_GROUND_ALIGNMENT_RH_DICHOTOMY.md` | `37f381b6ed75017633f4c845f90ff7d2660699bc0ae7a4340ec789b0e8dccea7` |
| `tests/test_cutoff_free_prolate_ground_alignment_rh_dichotomy.py` | `b17c3c603d459547c09fd0abb92b595986356e29e1d53f7e8c6f3ace4a8baf80` |
| `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md` | `3c3e0ac08089d84b414a05b8c8791fb49b588ca41fb21d39e6406e277875638f` |
| `tests/test_defect_relative_projection.py` | `21b33670a9d017d363f53776ba05ca93ce3588eb049ba9dcb7e61f202bc01999` |
| `notes/FULL_EXTERIOR_SAMPLING_FALLBACK.md` | `7dd2d8b6d32da5e1d98a6c96702a8079b53075eb756d1204219a4581c6296413` |
| `tests/test_full_exterior_sampling_fallback.py` | `62eb6f6bda3ab3cbcd24bfd095585c9dd154f6d08c3729ff0700f6d970b217ef` |
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |
| `notes/GROWING_WINDOW_THEOREM.md` | `dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7` |

The weighted-coframe pair fixes `F_m`, `D_m`, `mathcal K_m`, the finite
residual constant, and the hard-prefix criterion.  The growing transition
pair supplies the all-family variation estimate and finite residual
sampling.  The cutoff-free pair supplies the complete infinite
diagonal-plus-Cauchy operator and its graph-tail argument.  The defect pair
fixes the normalized Fourier/BV convention and the all-index defect floor.
The exterior pair fixes the arithmetic-map norm and the compact absolute
sampling constant.  The high-Fourier pair fixes every coefficient constant.
The growing-window note fixes the leading KRD estimate.

## 2. The two-parity BV envelope

Write

\[
 f=(f_+,f_-),\qquad
 D_m(f)=D_+(f_+)+D_-(f_-),                            \tag{2.1}
\]

and let `q_sigma` be the number of raw prolate modes in the corresponding
residue class.  Put `q_m=q_++q_-`.  Since the two classes together contain
only the even labels from zero through `m`,

\[
 q_m\leq{S+1\over2}=2\lambda^2+{1\over2}.             \tag{2.2}
\]

Retain the exact all-index floor and the growing-family variation constant

\[
 d_{\rm LS}=6\,96^{-5-(320\pi/\log2)\lambda^2},        \tag{2.3}
\]

\[
 c=2\pi\lambda^2,\qquad
 V_*(\lambda)=46\lambda c^3+108\pi\lambda^2.          \tag{2.4}
\]

The pinned transition index satisfies `n_*=S+b_lambda>S`, so every label
used here is in the scope of the growing transition theorem.  For a
same-phase combination, the proof of its equations (3.5)--(3.6) gives,
before any choice of physical inversion sign,

\[
 \operatorname {TV}_{[-L/2,L/2]}(A_\lambda f_\sigma)
 \leq V_*\sqrt{q_\sigma\over d_{\rm LS}}
             D_\sigma(f_\sigma)^{1/2}.                 \tag{2.5}
\]

Indeed, each raw profile has variation at most `V_*`, ordinary
Cauchy--Schwarz gives `sum|a_n|<=sqrt(q_sigma) ||a||_2`, and (2.3) gives
`||a||_2^2<=D_sigma/d_LS`.  The invisible origin correction does not alter
the compact profile.

Reflection preserves interval variation.  On the symmetric logarithmic
interval the plus average has equal endpoint traces.  For the minus average,
the circular wrap jump is exactly `|h(L/2)-h(-L/2)|`, which is at most the
interval variation.  Therefore, for either

\[
 S_\sigma={I+\sigma J\over2},\qquad\sigma\in\{+,-\},  \tag{2.6}
\]

closing the interval to the Fourier circle gives the sign-independent bound

\[
 \operatorname {TV}_{\rm circle}(S_\sigma h)
 \leq2\operatorname {TV}_{[-L/2,L/2]}(h).             \tag{2.7}
\]

The factor two in (2.7) keeps the possible wrap jump of the minus sector;
no endpoint equality is assumed there.  The arithmetic-map norm is

\[
 \|A_\lambda f_\sigma\|_2
 \leq{\lambda\over\sqrt2}\|f_\sigma\|_2
 \leq{\lambda\over\sqrt{2d_{\rm LS}}}
                  D_\sigma(f_\sigma)^{1/2}.             \tag{2.8}
\]

The two physical parities are orthogonal.  Summing (2.7), using (2.5),
(2.8), and scalar Cauchy--Schwarz, proves for
`x_f=mathcal K_m f`

\[
 \|x_f\|_2
 \leq{\lambda\over\sqrt{2d_{\rm LS}}}D_m(f)^{1/2},   \tag{2.9}
\]

\[
 \boxed{
 \operatorname {TV}_{\rm circle}(x_f)
 \leq {2V_*\sqrt{q_m}\over\sqrt{d_{\rm LS}}}
       D_m(f)^{1/2}.}                                    \tag{2.10}
\]

The normalized Fourier BV estimate now gives, for every nonzero integer
`n`,

\[
 |(x_f)_n|
 \leq{\sqrt L\over2\pi|n|}
       \operatorname {TV}_{\rm circle}(x_f).             \tag{2.11}
\]

The mean coefficient is bounded by (2.9).  Therefore, with

\[
 \boxed{
 A_{\lambda,m}={2\over\sqrt{d_{\rm LS}}}
 \left\{{\lambda\over\sqrt2}
 +{\sqrt{Lq_m}\,V_*\over\pi}\right\},}               \tag{2.12}
\]

all Fourier coefficients satisfy the common envelope

\[
 \boxed{
 |(x_f)_n|\leq {A_{\lambda,m}\over1+|n|}
                    D_m(f)^{1/2}\qquad(n\in\mathbb Z).} \tag{2.13}
\]

This proves the family estimate that was absent from the fixed-anchor graph
transfer.  Its only nonpolynomial loss is `d_LS^(-1/2)`.

## 3. Infinite diagonal-plus-Cauchy graph tail

In the complete source Fourier basis,

\[
 Q_\lambda=D_a+B_\lambda,\qquad
 B_\lambda=D_bH-HD_b,                                   \tag{3.1}
\]

\[
 H_{nr}=\begin{cases}(n-r)^{-1},&n\ne r,\\0,&n=r,
          \end{cases}
 \qquad\|H\|=\pi.                                      \tag{3.2}
\]

The frozen coefficient bounds are

\[
 |a_n|\leq\log(|n|+2)+C_{|a|}(\lambda)\quad(n\ne0),\qquad
 |b_n|\leq B_b(\lambda),                               \tag{3.3}
\]

where the exact elementary constants are

\[
 \begin{aligned}
 \sigma_L&=\log{L\over2\tanh(L/2)},\\
 C_a&={8(\lambda+\lambda^{-1}-2)\over L}
       +\lambda+2\sigma_L+4L(\lambda-1),\\
 C_{|a|}&=C_a+\log\coth(L/2)+{1\over2\pi},\\
 B_b&={2(\lambda-\lambda^{-1})\over\pi}
  +{1\over4}+{1\over2\pi^2}
  +{\lambda-1+\sigma_L\over2\pi}
  +{2L(\lambda-1)\over\pi}.
 \end{aligned}                                          \tag{3.4}
\]

Every quantity in (3.4) has polynomial/polylogarithmic growth.

For `|n|>=2`, an explicit version of the infinite Cauchy convolution lemma
is

\[
 \boxed{
 \sum_{r\ne n}{1\over(1+|r|)|n-r|}
 \leq32{1+\log(|n|+2)\over1+|n|}.}                    \tag{3.5}
\]

To prove (3.5), reflect so `n>=2`.  The region `|r|<=n/2` contributes at
most `(6+4 log n)/n`; the region `|r-n|<=n/2`, `r!=n`, contributes at most
`(4+4 log n)/n`; and the two remaining tails contribute at most `4/n`.
Their sum is bounded by the right side of (3.5).  In particular, the sum is
infinite: there is no hidden outer Fourier cutoff.

Equations (2.13), (3.1), and (3.5) give

\[
 |(B_\lambda x_f)_n|
 \leq64B_bA_{\lambda,m}
       {1+\log(|n|+2)\over1+|n|}D_m(f)^{1/2}.          \tag{3.6}
\]

The elementary two-sided tail bound

\[
 \sum_{|n|>N}{(1+\log(|n|+2))^2\over(1+|n|)^2}
 \leq32{(1+\log(N+2))^2\over N}                       \tag{3.7}
\]

follows by `1+log(n+2)<=2+log n`, monotone integral comparison, and
integrating `(2+log x)^2/x^2` exactly; the factor 32 covers both signs.
Together with (3.3) and (3.6), it proves

\[
 \|(I-P_N)Q_\lambda x_f\|
 \leq {\sqrt{32}\,A_{\lambda,m}\over\sqrt N}
 (1+C_{|a|}+64B_b)(1+\log(N+2))D_m(f)^{1/2}.          \tag{3.8}
\]

For the reverse cross, the diagonal has no contribution:

\[
 P_ND_a(I-P_N)=0.                                      \tag{3.9}
\]

Since `||B_lambda||<=2 pi B_b`, (2.13) gives

\[
 \|P_NQ_\lambda(I-P_N)x_f\|
 \leq {2\sqrt2\pi B_bA_{\lambda,m}\over\sqrt N}
                 D_m(f)^{1/2}.                         \tag{3.10}
\]

Finally,

\[
 Q_\lambda x_f-P_NQ_\lambda P_Nx_f
 =(I-P_N)Q_\lambda x_f
   +P_NQ_\lambda(I-P_N)x_f.                            \tag{3.11}
\]

Thus, defining

\[
 \boxed{
 \begin{aligned}
 \varepsilon_{\lambda,m,N}:={A_{\lambda,m}\over\sqrt N}
 \{&\sqrt{32}(1+C_{|a|}+64B_b)(1+\log(N+2))\\
    &+2\sqrt2\pi B_b\},
 \end{aligned}}                                        \tag{3.12}
\]

equations (3.8)--(3.11) prove the finite, uniform graph estimate

\[
 \boxed{
 \|Q_\lambda\mathcal K_mf
       -Q_{\lambda,N}P_N\mathcal K_mf\|
 \leq\varepsilon_{\lambda,m,N}D_m(f)^{1/2}.}          \tag{3.13}
\]

The coefficient envelope also proves directly that every `x_f` lies in the
operator domain: `D_ax_f` is square summable and `B_lambda` is bounded.

## 4. Locked exponent cancellation

By (2.2), (2.4), and (3.4), every factor in (3.12) other than
`N^(-1/2)d_LS^(-1/2)` is polynomial in `lambda,L`.  The remaining factor is
exactly

\[
 \begin{aligned}
 {1\over\sqrt{Nd_{\rm LS}}}
 &={96^{5/2}\over\sqrt6}
 \exp\left\{-\left(4800\log2
 -{160\pi\log96\over\log2}\right)\lambda^2\right\}\\
 &={96^{5/2}\over\sqrt6}e^{-M_{2400}\lambda^2}.
 \end{aligned}                                         \tag{4.1}
\]

The frozen exact margin is positive.  For a simple rational certificate,
use

\[
 \log2>{6931\over10000},\qquad
 \log96<{457\over100},\qquad \pi<{22\over7}.           \tag{4.2}
\]

The logarithmic bounds are certified by
`log x=2 sum_(j>=0) z^(2j+1)/(2j+1)`,
`z=(x-1)/(x+1)`, with the geometric tail denominator
`(2J+1)(1-z^2)`.  Four terms give
`log 2>53056/76545>6931/10000`; applying the corresponding upper bounds to
`log 96=5 log 2+log 3` gives
`log 96<100621607/22044960<457/100`.  The last inequality in (4.2) is the
classical Archimedean bound.

Then

\[
 30(\log2)^2-\pi\log96
 >30\left({6931\over10000}\right)^2
   -{22\over7}{457\over100}
 ={3413981\over70000000}>0,                              \tag{4.3}
\]

which is equivalent to (0.4).  Equations (3.12), (4.1), and (4.3) prove
(0.3), uniformly over the whole leading window.

## 5. Polynomial cutoff-free residual constant

The frozen finite radical identity and absolute sampling estimate give

\[
 \|Q_{\lambda,N}P_N\mathcal K_mf\|
 \leq\mathcal C^{\rm fin}_{\lambda,m}D_m(f)^{1/2},    \tag{5.1}
\]

\[
 \mathcal C^{\rm fin}_{\lambda,m}
 =\sqrt{B_{\rm abs}(\lambda,N)
          (C_{q_+}(\lambda)+C_{q_-}(\lambda))}
 =\operatorname {poly}(\lambda,L).                     \tag{5.2}
\]

Here an absent parity block contributes `C_0=0`; if `F_m={0}`, all operator
statements are read on the zero space and are immediate.

Combining (3.13) and (5.1) yields, for every `f in F_m`,

\[
 \|Q_\lambda\mathcal K_mf\|
 \leq(\mathcal C^{\rm fin}_{\lambda,m}
          +\varepsilon_{\lambda,m,N})D_m(f)^{1/2}.     \tag{5.3}
\]

On the positive support of `Delta_m`, substitute
`f=(Delta_m^dagger)^(1/2)u`.  Since
`D_m(f)=||u||^2`, equation (5.3) proves

\[
 \boxed{
 \mathcal C_{F_m}
 =\|Q_\lambda\mathcal K_m(\Delta_m^\dagger)^{1/2}\|
 \leq\mathcal C^{\rm fin}_{\lambda,m}
       +\varepsilon_{\lambda,m,N}.}                    \tag{5.4}
\]

Equations (0.3), (5.2), and (5.4) prove (0.5).  No cutoff-dependent
closed-graph constant has been inserted; all dependence is displayed in
(2.12) and (3.12).

## 6. Reduced hard-prefix stopping line

The weighted-coframe theorem gives the exact sufficient ratio

\[
 {8\mathcal C_{F_m}^2\lambda^4d_m\over\gamma_m}
 \longrightarrow0.                                      \tag{6.1}
\]

The leading KRD estimate is

\[
 d_m\leq10\exp\left\{-{S-m-7\over\beta_\lambda}\right\},
 \qquad
 \beta_\lambda={2\over\pi^2}\log(200\lambda^2+25).    \tag{6.2}
\]

Since (0.5) now gives
`log(1+C_(F_m))=O(log lambda+log L)` uniformly, a sufficient hard-prefix
line whose sole new analytic input is capture is

\[
 \boxed{
 {S-m-7\over\beta_\lambda}
 -\log{1\over\gamma_m}
 -O(\log\lambda+\log L)\longrightarrow+\infty.}        \tag{6.3}
\]

For example, a bound `gamma_m>=lambda^(-D)L^(-E)` at

\[
 m=S-K(\log\lambda)^2                                  \tag{6.4}
\]

with downward integer rounding and sufficiently large fixed `K` would make
(6.1) hold.  Neither that
capture estimate nor any weaker estimate sufficient for (6.3) is proved
here.  The full-source coframe floor does not imply it, as shown by the
frozen orientation countermodel.  This theorem removes the residual-map
gate and leaves the normalized principal angle as the exact remaining
bottleneck.
