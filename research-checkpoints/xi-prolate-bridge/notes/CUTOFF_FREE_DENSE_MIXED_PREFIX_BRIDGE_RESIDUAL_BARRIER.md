# Cutoff-free dense mixed-prefix graph theorem and bridge residual barrier

## 0. Exact outcome and claim boundary

Work in the frozen odd-half-integer regime

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad S=4\lambda^2.                 \tag{0.1}
\]

Here `L` is exactly the logarithmic length of
`[lambda^(-1),lambda]`; no doubled or `p=2 lambda` interval convention is
used.

and use the locked Fourier cutoff

\[
 N=2^{9600\lambda^2}.                                  \tag{0.2}
\]

Let `h_n` be the pinned real, unit-normalized even prolate modes, put

\[
 I_n=\int_{-\lambda}^{\lambda}h_n(x)\,dx,
 \qquad
 c_{2j}=h_{2j}-{I_{2j}\over I_0}h_0,                  \tag{0.3}
\]

and define the ordinary corrected all-even prefix and its two-copy version

\[
 F_M^{\rm mix}=\operatorname {span}(c_2,c_4,\ldots,c_{2M}),
 \qquad
 \mathfrak F_M^{\rm mix}=F_M^{\rm mix}\oplus F_M^{\rm mix}. \tag{0.4}
\]

One copy in (0.4) is sent through each physical inversion sign.  This note
proves the following theorem/barrier pair.

1.  The spaces in (0.4) are nested and dense in the two-copy even
    zero-integral source.  The state-invisible correction has exactly the
    same restricted physical map as the uncorrected source.  Thus the
    non-density caveat for the phase-separated Pair C source is genuinely
    removed.
2.  In residue-plus-bridge coordinates

\[
 p_j=c_{4j},\qquad b=c_2,
 \qquad m_j=-h_{4j+2}+{I_{4j+2}\over I_2}h_2,          \tag{0.5}
\]

    both the full source Gram and the modal exterior-defect Gram are exact
    nonorthogonal block matrices.  In particular, neither bridge cross block
    may be deleted.
3.  For every hard prefix `2M<=S-1`, the two-parity bounded-variation and
    infinite diagonal-plus-Cauchy proof gives a uniform cutoff-free graph
    tail

\[
 \|Q_\lambda\mathcal K_Mf
       -Q_{\lambda,N}P_N\mathcal K_Mf\|
 \leq \varepsilon^{\rm mix}_{\lambda,M,N}
       D_M^{\rm mod}(f)^{1/2},                         \tag{0.6}
\]

\[
 \varepsilon^{\rm mix}_{\lambda,M,N}
 \leq\operatorname {poly}(\lambda,L)
       e^{-M_{2400}\lambda^2},
 \qquad
 M_{2400}=4800\log2-{160\pi\log96\over\log2}>0.     \tag{0.7}
\]

    This is a theorem about the graph-transfer tail.  It is not a polynomial
    bound for the complete residual relative to modal defect.
4.  The bridge prevents that promotion.  For every mixed prefix containing
    `b` and `m_1`, at least one physical parity has

\[
 \boxed{
 \mathcal C^{\rm mod}_{\mathfrak F_M}
 \geq c\lambda^{-9/2}e^{2\pi\lambda^2}.}              \tag{0.8}
\]

    Thus the complete modal-defect residual constant is exponentially large,
    even though its graph-tail part in (0.6) is exponentially small.
5.  A canonical safe bump-aware control metric is the full two-row
    augmentation

\[
 \Delta_M^{\rm aug}
 =\Delta_M^{\rm mod}
  +{\kappa_\psi\over2\lambda}\ell_{0,M}^*\ell_{0,M},
 \qquad
 \ell_{0,M}(f_+,f_-)=(f_+(0),f_-(0)),                 \tag{0.9}
\]

    It is the direct sum of one rank-one origin Gram per physical copy: all
    within-copy cross terms are retained and every inter-copy cross is zero.
    It has

\[
 d_M^{\rm aug}:=\|\Delta_M^{\rm aug}\|\geq {c\over\lambda},
 \qquad
 \mathcal C^{\rm aug}_{\mathfrak F_M}\geq c\lambda^{-3/2}. \tag{0.10}
\]

    Hence the scalar normalized-angle sufficient ratio obeys

\[
 {8(\mathcal C^{\rm aug}_{\mathfrak F_M})^2
        \lambda^4d_M^{\rm aug}\over\gamma_M}
 \geq {c\over\gamma_M}\geq c.                        \tag{0.11}
\]

    Density, and even the hypothetical best value `gamma_M=1`, cannot make
    this ratio vanish.  The honest remaining line is the exact weighted one

\[
 \boxed{
 { (\mathcal C^{\rm aug}_{\mathfrak F_M})^2
      \over\Lambda_M^{\rm aug}}\longrightarrow0,
 \qquad
 \Lambda_M^{\rm aug}
 =\lambda_{\min}^{+}
   \left(T_M(\Delta_M^{\rm aug})^\dagger T_M^*\right).} \tag{0.12}
\]

Here `dagger` is the Moore--Penrose inverse on the positive support of the
declared defect.  If
`ran(T_M((Delta_M^aug)^dagger)^(1/2))` is not all of `X`, set
`Lambda_M^aug=0`.  Otherwise the minimum-defect right-inverse theorem gives
`|mu_lambda|^2 <= (C_(mathfrak F_M)^aug)^2/Lambda_M^aug`, so (0.12) is an
exact sufficient stopping line.

No estimate proving (0.12), no bottom-space conclusion, no Weil positivity,
and no statement about the Riemann hypothesis is asserted here.

## 1. Frozen dependencies

The following bytes are inputs and are not modified by this note.

| file | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md` | `c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c` |
| `tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py` | `d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11` |
| `notes/CUTOFF_FREE_UNIFORM_RADICAL_GRAPH_TRANSFER_THEOREM.md` | `aa69ac86e6b5d5256ba3b243b9fc07d9c5ad49bed7a70e3d570d0c57325bce18` |
| `tests/test_cutoff_free_uniform_radical_graph_transfer_theorem.py` | `b2708c8f72ce8bad831b2aea44c49ef3a8ec5f9c38551c288a1c982d097ee727` |
| `notes/EFFECTIVE_MIXED_PREFIX_SCHEDULE_ATTACK.md` | `a33e7a072057f1444afb9d00911465f599fec508d0a6488e655638947cc515ba` |
| `notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md` | `335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb` |
| `tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py` | `0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc` |
| `notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md` | `43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2` |
| `tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py` | `95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a` |
| `notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md` | `04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83` |
| `tests/test_fixed_source_block_shift_asymptotic_theorem.py` | `433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |

The weighted-coframe note supplies the minimum-defect right inverse and the
exact stopping statistic.  The graph-transfer note supplies the infinite
Cauchy estimate and locked exponent.  The effective-mixed note supplies the
dense triangular decomposition.  The two bridge notes supply the endpoint
gauge scale and coherent beta diagonal.  The fixed-source theorem supplies
the pinned fixed-label defect asymptotics.  The radical identity fixes the
state-invisible bump and its exact scope.

## 2. Dense two-copy source and exact restricted physical map

Let `mathcal H_0^ev` be the even source space with zero integral.  The
integral is a continuous functional on the compact source interval, and
`I_0>0`.  If `g_r` is a finite even prolate sum converging to
`g in mathcal H_0^ev`, then

\[
 g_r^0=g_r-{\int g_r\over I_0}h_0
 \longrightarrow g.                                  \tag{2.1}
\]

Every `g_r^0` is a finite linear combination of the vectors in (0.3).
Therefore

\[
 \overline{\bigcup_{M\geq1}F_M^{\rm mix}}=\mathcal H_0^{\rm ev},
 \qquad
 \overline{\bigcup_{M\geq1}\mathfrak F_M^{\rm mix}}
 =\mathcal H_0^{\rm ev}\oplus\mathcal H_0^{\rm ev}.  \tag{2.2}
\]

Fix the bump from the radical identity and set

\[
 \widetilde f(x)=f(x)-f(0)\psi(2\lambda x),
 \qquad
 \mathcal K_{M,\sigma}f
 =C_\lambda S_\sigma\mathcal E(\widetilde f),
 \qquad S_\sigma={I+\sigma J\over2}.                 \tag{2.3}
\]

The support of the correction is strictly inside `|x|<lambda^(-1)`, so
for every compact arithmetic sample

\[
 C_\lambda\mathcal E(\widetilde f)
 =C_\lambda\mathcal E(f).                             \tag{2.4}
\]

Let `X_sigma` be the bottom space in physical inversion sector `sigma` and
define

\[
 T_{\infty,\sigma}f=P_{X_\sigma}S_\sigma A_\lambda f.
                                                               \tag{2.5}
\]

Equations (2.3)--(2.4) identify only the restricted physical map:

\[
 T_{M,\sigma}=T_{\infty,\sigma}P_{F_M^{\rm mix}},
 \qquad
 T_M=T_{M,+}\oplus T_{M,-}.                           \tag{2.6}
\]

They do not identify the global corrected radical with the uncorrected
global representative.

For completeness, put

\[
 R_\lambda=T_\infty T_\infty^*,
 \qquad U_\lambda=R_\lambda^{-1/2}T_\infty,
 \qquad U_\lambda U_\lambda^*=I_X.                   \tag{2.7}
\]

The exact normalized principal-angle statistic is

\[
 \boxed{
 \gamma_M
 =\lambda_{\min}(U_\lambda P_{\mathfrak F_M^{\rm mix}}U_\lambda^*)
 =1-\|(I-P_{\mathfrak F_M^{\rm mix}})U_\lambda^*\|^2.} \tag{2.8}
\]

At fixed `lambda`, (2.2) and finite dimensionality of `X` imply
`gamma_M -> 1` as `M -> infinity`.  This qualitative limit gives no rate
inside the hard window `2M<=S-1`; in particular, it gives no near-Shannon
lower bound uniform in `lambda`.

## 3. Exact residue-plus-bridge source and defect Grams

Assume the frozen certification `I_2!=0`.  For a finite prefix, use the
indices for which `4j<=2M` and `4j+2<=2M`, and write

\[
 u_j={I_{4j}\over I_0},\qquad
 \beta={I_2\over I_0},\qquad
 a_j={I_{4j+2}\over I_2}.                             \tag{3.1}
\]

With columns ordered as `(p,b,m)`, orthonormality of the pure prolate modes
gives the complete source Gram

\[
 \boxed{
 G_M^{\rm src}=
 \begin{bmatrix}
 I+uu^*&\beta u&0\\
 \beta u^*&1+\beta^2&a^*\\
 0&a&I+aa^*
 \end{bmatrix}.}                                      \tag{3.2}
\]

Let

\[
 d_n=1-\chi_n^2,
 \qquad
 D_4=\operatorname {diag}(d_4,d_8,\ldots),
 \qquad
 D_T=\operatorname {diag}(d_6,d_{10},\ldots).        \tag{3.3}
\]

Exterior orthogonality gives the exact modal-defect Gram

\[
 \boxed{
 \Delta_M^{\rm mod}=
 \begin{bmatrix}
 D_4+d_0uu^*&d_0\beta u&0\\
 d_0\beta u^*&d_2+d_0\beta^2&d_2a^*\\
 0&d_2a&D_T+d_2aa^*
 \end{bmatrix}.}                                      \tag{3.4}
\]

The ordinary mixed columns obey

\[
 c_{4j+2}=-m_j+a_jb.                                  \tag{3.5}
\]

Thus the ordinary and separated coordinate matrices differ by an
invertible triangular matrix `mathcal S_M`, and

\[
 G_{M,\rm ord}^{\rm src}=\mathcal S_M^*G_M^{\rm src}\mathcal S_M,
 \qquad
 \Delta_{M,\rm ord}^{\rm mod}
 =\mathcal S_M^*\Delta_M^{\rm mod}\mathcal S_M.       \tag{3.6}
\]

Any endpoint shear is another exact congruence.  Equations (3.2)--(3.6)
retain both the `d_0 beta u` and `d_2 a` bridge crosses.  The two physical
source copies have the block-diagonal duplicate of these complete matrices.
Thus, on `mathfrak F_M^mix`, the actual modal-defect operator is
`Delta_M^mod direct-sum Delta_M^mod`; below the same symbol denotes this
two-copy operator when its domain is unambiguous.

Use the first tail residue

\[
 m_1=-h_6+a_1h_2,
 \qquad
 b^\#=b-\eta m_1,
 \qquad
 \eta={b(\lambda)\over m_1(\lambda)}.                \tag{3.7}
\]

The frozen fixed-label laws give

\[
 d_2\asymp\lambda^5e^{-4\pi\lambda^2},
 \qquad
 \eta=\Theta(\lambda^{-4}),
 \qquad
 D_M^{\rm mod}(b^\#)=\Theta(d_2).                    \tag{3.8}
\]

If `v_n=h_n(0)`, the exact integral identity gives

\[
 \beta=-{\chi_2v_2\over\chi_0v_0},
 \qquad
 b(0)=v_2\left(1+{\chi_2\over\chi_0}\right),
 \qquad
 A_\lambda:=b^\#(0)\longrightarrow2^{3/4}.           \tag{3.9}
\]

In particular the endpoint shear kills the hard endpoint but does not make
the bridge value at the origin modal-defect small.

## 4. Uniform mixed graph transfer

Let `f=(f_+,f_-) in mathfrak F_M^mix`, where each copy is expanded in the
raw modal basis.  Define

\[
 D_M^{\rm mod}(f)
 =\sum_{\sigma\in\{+,-\}}\sum_{\substack{0\leq n\leq2M\\ n\ \mathrm{even}}}
       d_n|\alpha_{\sigma,n}|^2.                      \tag{4.1}
\]

There are at most

\[
 q_M^{\rm mix}=2(M+1)\leq S+1                        \tag{4.2}
\]

raw modal coefficients when `2M<=S-1`.  Retain the frozen all-index floor
and variation envelope

\[
 d_{\rm LS}=6\,96^{-5-(320\pi/\log2)\lambda^2},
 \qquad
 V_*(\lambda)=46\lambda(2\pi\lambda^2)^3
                  +108\pi\lambda^2.                  \tag{4.3}
\]

The raw variation proof does not use additive Fourier phase.  Ordinary
Cauchy--Schwarz and (4.3) give

\[
 \sum_{\sigma,n}|\alpha_{\sigma,n}|
 \leq\sqrt{q_M^{\rm mix}\over d_{\rm LS}}
          D_M^{\rm mod}(f)^{1/2}.                     \tag{4.4}
\]

Replacing `S_+` by `S_-` changes only unit signs between reflected profiles.
The possible circular wrap jump costs at most one additional interval
variation.  Therefore the proof of the frozen graph theorem applies to the
two complete mixed copies and gives, for `x_f=mathcal K_Mf`,

\[
 \|x_f\|_2\leq{\lambda\over\sqrt{2d_{\rm LS}}}
                    D_M^{\rm mod}(f)^{1/2},           \tag{4.5}
\]

\[
 \operatorname {TV}_{\rm circle}(x_f)
 \leq {2V_*\sqrt{q_M^{\rm mix}}\over\sqrt{d_{\rm LS}}}
                    D_M^{\rm mod}(f)^{1/2}.           \tag{4.6}
\]

Consequently every normalized log-Fourier coefficient satisfies

\[
 |(x_f)_n|\leq{A_{\lambda,M}^{\rm mix}\over1+|n|}
                 D_M^{\rm mod}(f)^{1/2},              \tag{4.7}
\]

\[
 \boxed{
 A_{\lambda,M}^{\rm mix}
 ={2\over\sqrt{d_{\rm LS}}}
  \left\{{\lambda\over\sqrt2}
  +{\sqrt{Lq_M^{\rm mix}}\,V_*\over\pi}\right\}.} \tag{4.8}
\]

In the complete Fourier basis, use

\[
 Q_\lambda=D_a+B_\lambda,
 \qquad B_\lambda=D_bH-HD_b,
 \qquad H_{nr}={1\over n-r}\quad(n\ne r),             \tag{4.9}
\]

and the exact frozen envelopes

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
 \end{aligned}                                         \tag{4.10}
\]

The infinite Cauchy convolution estimate is

\[
 \sum_{r\ne n}{1\over(1+|r|)|n-r|}
 \leq32{1+\log(|n|+2)\over1+|n|}.                    \tag{4.11}
\]

There is no hidden outer Fourier cutoff in (4.11).  Equations
(4.7)--(4.11), including the reverse Cauchy cross, give

\[
 \boxed{
 \begin{aligned}
 \varepsilon^{\rm mix}_{\lambda,M,N}
 :={A_{\lambda,M}^{\rm mix}\over\sqrt N}
 \{&\sqrt{32}(1+C_{|a|}+64B_b)(1+\log(N+2))\\
    &+2\sqrt2\pi B_b\}.
 \end{aligned}}                                        \tag{4.12}
\]

With `Q_(lambda,N)=P_NQ_lambda P_N`, this proves (0.6).  Moreover

\[
 {1\over\sqrt{Nd_{\rm LS}}}
 ={96^{5/2}\over\sqrt6}
   e^{-M_{2400}\lambda^2}.                            \tag{4.13}
\]

The exact rational certificate

\[
 30(\log2)^2-\pi\log96
 >30\left({6931\over10000}\right)^2
   -{22\over7}{457\over100}
 ={3413981\over70000000}>0                            \tag{4.14}
\]

proves `M_2400>0`.  Since (4.2), (4.8), and (4.10) have only polynomial or
polylogarithmic remaining growth, (4.12)--(4.14) prove (0.7).

## 5. The bridge makes the modal residual constant exponential

For the endpoint-sheared bridge, let

\[
 q_{\sigma,N}(b^\#)
 =\langle Q_{\lambda,N}P_Nx_{\sigma,b},P_Nx_{\sigma,b}\rangle,
 \qquad
 x_{\sigma,b}=\mathcal K_{M,\sigma}b^\#.             \tag{5.1}
\]

The coherent beta theorem and its pinned paired-slot convention give fixed
unit signs `epsilon_sigma in {+1,-1}` such that

\[
 \varepsilon_+q_{+,N}(b^\#)+\varepsilon_-q_{-,N}(b^\#)
 ={A_\lambda^2C_\xi\over4\lambda}+o(\lambda^{-1}),
 \qquad
 C_\xi=2+\gamma_{\!E}-\log(4\pi)>0.                  \tag{5.2}
\]

Equivalently, before absorbing sector signs into the physical quadratic
forms, the beta-carrier identity is `F_+^2-F_-^2`.  Formula (5.2) is therefore
independent of which of those two equivalent sign conventions names
`q_(sigma,N)`.  Only absolute sector self-values will be used below.
The leading corrected bump is the representative of the beta term, not an
additional diagonal.  The triangle inequality applied to (5.2) gives

\[
 \max_{\sigma\in\{+,-\}}|q_{\sigma,N}(b^\#)|
 \geq {c\over\lambda}.                                \tag{5.3}
\]

The frozen arithmetic-map norm and bounded source norm of the fixed bridge
give

\[
 \|x_{\sigma,b}\|\leq C\lambda.                      \tag{5.4}
\]

On the bridge, (0.6), (3.8), and (0.7) give

\[
 \|Q_\lambda x_{\sigma,b}
       -Q_{\lambda,N}P_Nx_{\sigma,b}\|
 \leq\varepsilon^{\rm mix}_{\lambda,M,N}\sqrt{D_M^{\rm mod}(b^\#)}
 =o(\lambda^{-K})                                      \tag{5.5}
\]

for every fixed `K`.  Since the compressed output lies in `ran(P_N)`,
(5.4)--(5.5) imply

\[
 \left|\langle Q_\lambda x_{\sigma,b},x_{\sigma,b}\rangle
              -q_{\sigma,N}(b^\#)\right|
 \leq C\lambda\varepsilon^{\rm mix}_{\lambda,M,N}
                  \sqrt{D_M^{\rm mod}(b^\#)}
 =o(\lambda^{-1}).                                    \tag{5.6}
\]

Cauchy--Schwarz, (5.3)--(5.4), and (5.6) therefore imply, for at least one
physical
sign,

\[
 \|Q_\lambda x_{\sigma,b}\|\geq {c\over\lambda^2}.  \tag{5.7}
\]

Both physical copies contain the same bridge direction, so the sign selected
by (5.3) is present in `mathfrak F_M^mix`.  Define the complete modal
residual-map constant on the positive support by

\[
 \mathcal C^{\rm mod}_{\mathfrak F_M}
 =\|Q_\lambda\mathcal K_M
       ((\Delta_M^{\rm mod})^\dagger)^{1/2}\|.        \tag{5.8}
\]

Equations (3.8) and (5.7) give

\[
 \mathcal C^{\rm mod}_{\mathfrak F_M}
 \geq {c\lambda^{-2}\over\sqrt{d_2}}
 \geq c\lambda^{-9/2}e^{2\pi\lambda^2},             \tag{5.9}
\]

which is (0.8).  The use of an operator norm keeps all cross terms and has
no source-dimension loss.  Minkowski synthesis cannot erase the pure bridge
test direction.  Thus (0.6) closes the graph tail but the finite coherent
bridge term rules out a polynomial complete constant relative to modal
defect.

## 6. Honest bump-aware augmentation and the gamma-only failure

The locked correction has additive exterior bump energy

\[
 D_{\rm bump}(f_+,f_-)
 ={\kappa_\psi\over2\lambda}
   \left(|f_+(0)|^2+|f_-(0)|^2\right),
 \qquad
 \kappa_\psi=\int_{|\xi|\geq1/2}|\widehat\psi(\xi)|^2\,d\xi>0. \tag{6.1}
\]

This motivates exactly the safe augmented control form

\[
 D_M^{\rm aug}(f)
 =D_M^{\rm mod}(f)
  +{\kappa_\psi\over2\lambda}\|\ell_{0,M}(f)\|^2,
 \qquad
 \ell_{0,M}:\mathfrak F_M^{\rm mix}\longrightarrow\mathbb C^2,
 \quad
 \ell_{0,M}(f_+,f_-)=(f_+(0),f_-(0)).                 \tag{6.2}
\]

Equation (6.2) is not a diagonal bridge penalty.  The map `ell_(0,M)` has
two rows with disjoint source-copy supports.  Its second term is generically
rank two on the doubled source and is exactly the direct sum

\[
 {\kappa_\psi\over2\lambda}
 \left(\ell_{0,M,+}^*\ell_{0,M,+}
       \oplus\ell_{0,M,-}^*\ell_{0,M,-}\right).       \tag{6.3}
\]

Each summand in (6.3) is a complete rank-one Gram within its physical copy,
including all residue--bridge and residue--residue crosses.  There is no
plus/minus source cross.  The elementary square inequality gives the honest
corrected-exterior control

\[
 D_M^{\rm corr}(f)\leq2D_M^{\rm aug}(f).              \tag{6.4}
\]

The modal and bump pieces can therefore be kept together by Minkowski or by
the exact augmented operator norm.  What cannot be done is absorb the bump
piece into modal defect.

On the endpoint-sheared bridge, (3.8)--(3.9) and (6.1) give

\[
 D_{\rm bump}(b^\#)
 ={\kappa_\psi|A_\lambda|^2\over2\lambda}
 =\Theta(\lambda^{-1})\gg D_M^{\rm mod}(b^\#),
 \qquad
 D_M^{\rm aug}(b^\#)=\Theta(\lambda^{-1}).            \tag{6.5}
\]

Since `||b#||=Theta(1)`, the Rayleigh quotient in (6.5) proves the first
inequality in (0.10).  Define

\[
 \mathcal C^{\rm aug}_{\mathfrak F_M}
 =\|Q_\lambda\mathcal K_M
       ((\Delta_M^{\rm aug})^\dagger)^{1/2}\|.        \tag{6.6}
\]

Testing (6.6) on the physical sign selected by (5.3) and using (5.7), (6.5)
gives the second inequality in (0.10):

\[
 \mathcal C^{\rm aug}_{\mathfrak F_M}
 \geq {c\lambda^{-2}\over\sqrt{\lambda^{-1}}}
 =c\lambda^{-3/2}.                                    \tag{6.7}
\]

The full-source normalized coframe floor is

\[
 T_\infty T_\infty^*\succeq{1\over8\lambda^4}I_X.   \tag{6.8}
\]

Combining (2.8), (6.8), and
`Delta_M^aug <= d_M^aug I` gives the familiar sufficient lower bound

\[
 \Lambda_M^{\rm aug}
 \geq{\gamma_M\over8\lambda^4d_M^{\rm aug}}.         \tag{6.9}
\]

But (0.10) inserted into the sufficient ratio from (6.9) proves (0.11).
This obstruction is stronger than a missing quantitative density theorem:
the scalar ratio fails even at `gamma_M=1`.

It does not prove that the exact weighted statistic in (0.12) fails.  The
operator `T_M(Delta_M^aug)^dagger T_M^*` retains the orientation and leverage
of the two per-copy origin directions, whereas the pair
`(gamma_M,d_M^aug)`
forgets both.  Equivalently, for the minimum-augmented-defect right inverse
`B_M`, a new estimate must control the coherent bridge response together
with its right-inverse leverage, schematically

\[
 \|Q_\lambda x_b\|\,\|\ell_bB_M\|\longrightarrow0.   \tag{6.10}
\]

Neither density nor (2.8) implies (6.10).

## 7. Final stopping statement

The mixed-prefix attack has a clean split verdict.

* The full corrected all-even prefix in each physical parity is dense.
* Its exact nonorthogonal source and modal Grams are (3.2) and (3.4).
* Its infinite graph-transfer tail is uniformly controlled by (4.12) and
  the positive locked margin (4.14).
* Its bridge has corrected bump/coherent-beta scale `lambda^(-1)`, while its
  modal defect is `Theta(lambda^5 exp(-4 pi lambda^2))`.  This forces (5.9).
* The full two-row augmentation (6.2)--(6.3) is an honest control metric, but its
  unavoidable maximal scale and residual floor make the normalized
  `gamma_M`/max-defect criterion nonvanishing.

Accordingly, the sole legitimate stopping line is (0.12), or an equivalent
orientation-sensitive bridge-leverage estimate such as (6.10).  The dense
mixed prefix removes the phase-separated non-density caveat; it does not
close the bottom-space problem.
