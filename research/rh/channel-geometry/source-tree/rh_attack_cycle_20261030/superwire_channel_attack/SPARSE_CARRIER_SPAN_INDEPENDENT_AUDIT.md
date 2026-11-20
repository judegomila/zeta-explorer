# Independent audit: sparse coherent carrier spans

30 October 2026. **PASS for the restricted theorem below.** This is independent
internal mathematical review, not external peer review or formal verification.
The review derives the cross-carrier estimate rather than relying on channel
intensity or an assumed physical analogy. No spectral experiment was performed.

## Reviewed statement and scope

Fix `0<delta<(log 2)/2`, a fixed nonzero `r`-dimensional complex even subspace
`U` of `C_c^infinity((-delta,delta))`, and fixed even smooth `chi` with
`m(chi)!=0`, where `m(v)=integral cosh(x/2)v(x)dx`. Define

    N_t u = u cos(tx) - [m(u cos(t .))/m(chi)] chi.

Put `T=exp(2b)`, `L=exp(b)`, and `ell=b+2delta`. For all sufficiently large
`b` there are `m_b` pairwise `L`-separated good carriers in `[T,2T]`, with

    exp(b)/4 <= m_b <= exp(b)+1,

such that the common (coherent) span of their paired actual packets is
positive for the actual signed Weil form. More precisely, for

    F_b(u_1,...,u_m) = sum_j N_(t_j)u_j,
    J_b v = [v(.+b)+v(.-b)]/sqrt(2),

one has, for sufficiently large `b`,

    (1/4) sum_j ||u_j||^2 <= ||F_b u||^2 <= sum_j ||u_j||^2,
    H_ell[J_b F_b u] >= (log T)/16 sum_j ||u_j||^2.       (A)

The dimension is exactly `r m_b`, not merely a collection of separate
`r`-dimensional positive sectors. Every cross-carrier term is included.
The onset depends on the fixed envelopes and their smooth seminorms; no
uniformity over growing `U` is asserted.

If the previously accepted actual physical head satisfies
`||H_ell P_ell||<=eta_ell=O(ell^-2)`, its true orthogonal complement
`Q_ell=I-P_ell` additionally satisfies

    H_ell[Q_ell J_b F_b u] >= (log T)/32 sum_j ||u_j||^2. (B)

Thus the projected span still has dimension `r m_b` and physical L2 floor at
least `(log T)/32`. This does not estimate its remaining physical complement.

## 1. Source diagonal bound and good-carrier selection

The annular source uses the actual prime-power inventory
`s_n=log n-2b`, `|s_n|<2delta`, with weights `a_n=Lambda(n)/sqrt(n)`.
Chebyshev gives `M_b=sum a_n=O_delta(exp(b))` and
`sum a_n^2=O_delta(b)`, `sum n a_n^2=O_delta(exp(2b)b)`.
For the actual finite matrix Dirichlet polynomial

    D_b(t)=sum_n a_n exp(it s_n) B(s_n),

the Montgomery--Vaughan mean-value estimate, applied entrywise and then
summed, gives `integral_T^(2T)||D_b(t)||_F^2 dt=O_delta(rTb)` at `T=exp(2b)`.
The compression `B(s)` has Frobenius norm squared at most `r`, so the factor
is `r`, not an unrecorded `r^2`. Consequently the complement of

    Good_b={t in [T,2T]: ||Re_H D_b(t)|| <= (log T)/2}

has relative measure `O_delta(r/b)`. This set is closed, since the polynomial
is continuous. The source's exact-neutral modulation calculation gives

    H_ell[J_b N_t u] >= (log T)/8 ||u||^2, t in Good_b,  (1)

once `b` is sufficiently large. The review checked the factor `1/2` in the
prime correlation and the gamma leading coefficient `1/2`; these are
consistent with (1).

For large `b`, `|Good_b|>=T/2`. A maximal `L`-separated finite subset covers
`Good_b` by intervals of radius `L`. Therefore `2Lm_b>=T/2`; ordering the
points also gives `(m_b-1)L<=T`. This proves the displayed cardinality
bounds. No random phases, probability law, or numerical carrier sampling is
used. The points are chosen only from the actual arithmetic good set.

The primary mean-value source was reopened during this audit:
H. L. Montgomery and R. C. Vaughan, *Hilbert's inequality*, JLMS (2) 8
(1974), 73--82, Corollary 3, equation (1.11),
https://personal.science.psu.edu/rcv4/personal/Publications/s2-8-1-73.pdf .

## 2. Uniform shift and physical Gram cross bounds

All norms on the fixed finite-dimensional `U` are equivalent. Hence for
each fixed integer `K`, all compact-support smooth seminorms of unit
vectors in `U` are uniformly bounded. Repeated integration by parts gives
`|alpha_t(u)|<=C_K T^-K||u||` for `t in [T,2T]`.

Expand the product of the two cosines in
`<u cos(t .), S_h(v cos(s .))>`. Each term is a unit-modulus factor
`exp(+/- i s h)` times an integral of a uniformly smooth compact amplitude
against frequency `+/- t +/- s`. For all real `h`, the amplitude seminorms
are uniform; clipped zero extension causes no boundary discontinuity because
the original envelopes are compactly supported smooth functions on R.
Consequently, for every fixed `K`,

    |<N_tu,S_h N_sv>|
       <= C_K [(1+|t-s|)^(-K)+T^(-K)] ||u||||v||,       (2)

uniformly in `|h|<=2delta` and `t,s in [T,2T]`. Corrections involving `chi`
are bounded using the small scalar `alpha` and the L2 contraction property
of the clipped shift. The same bound holds for symmetrized shifts and for
`h=0`, which supplies the physical Gram offdiagonal bound.

The diagonal Gram is `(1/2)I_U+O_K(T^-K)`. Ordered pairwise `L`-separated
carriers obey

    sup_j sum_(k!=j) (1+|t_j-t_k|)^(-K)
       <= 2 zeta(K) L^(-K), K>1.                       (3)

The term `T^-K` costs at most `m_b T^-K` per row. The block Schur test thus
gives

    F_b*F_b = (1/2)I + O_K(L^-K+m_b T^-K).             (4)

This estimate is in the actual physical L2 metric. It proves the Gram
bounds and the dimension claimed in (A), despite growing `m_b`.

## 3. Gamma weighted Fourier overlap

Let `a(xi)=Re digamma(1/4+i xi/2)-log pi`; it obeys
`|a(xi)|<=C log(e+|xi|)` on the real line. Every Fourier profile from the
fixed envelope family is Schwartz with uniformly bounded seminorms.
The digamma growth follows from its sectorial asymptotic and boundedness on
compact subsets of this pole-free vertical line; the official formula was
checked at https://dlmf.nist.gov/5.11#E2 during this audit.
For centers `p,q in [-2T,2T]` and profiles `vhat,what` from this family,

    integral |a(xi)||vhat(xi-p)||what(xi-q)| dxi
       <= C_K log(e+T) (1+|p-q|)^(-K).                (5)

One direct proof uses
`log(e+|xi|)<=log(e+2T)+log(e+|xi-p|)` and absorbs the second logarithm
in one extra Schwartz power. Split R according to
`|xi-p|>=|p-q|/2` or `|xi-q|>=|p-q|/2`; retaining an additional integrable
power on the large-distance factor proves (5). This argument needs only a
growth bound for the multiplier, not positivity or frequency compactness.

The cosine has centers `+/-t`, and `+/-s`; the opposite-sign distances are
at least `2T`. Terms involving `alpha chi` satisfy the same bound with a
`C_K log T T^-K` error. Therefore

    |Gamma_(1/4)[N_tu,N_sv]|
      <= C_K log T [(1+|t-s|)^(-K)+T^-K] ||u||||v||.    (6)

This addresses the main potential analytic gap in the proposed extension.
No sharp frequency cutoff is used and no compact-support/bandlimit
incompatibility is introduced.

## 4. Actual signed arithmetic and coherent-span positivity

Every `F_bu` is exactly moment-neutral by linearity. Thus the full paired
identity is exactly

    H_ell[J_b F_bu] = B_b[F_bu]-C_b[F_bu],
    B_b=Gamma_(1/4)-X_b,   0<=C_b<=epsilon_b I,
    epsilon_b=O_delta(exp(-5b)).                        (7)

The pole term vanishes jointly; no separated large prime/pole magnitudes
are estimated. The actual prime weights and shift phases are retained in
the finite signed matrix. Applying (2) to its offdiagonal entries gives

    |X_b[N_tu,N_sv]|
       <= C_K M_b [(1+|t-s|)^(-K)+T^-K] ||u||||v||.     (8)

This last absolute bound is used only *between separated carriers*, not on
the diagonal, where the arithmetic mean-square cancellation is essential.
The block Schur row bound for the offdiagonal matrix of `B_b` is

    rho_b <= C_K (M_b+log T)(L^-K+m_b T^-K).             (9)

With `K=3`, `M_b=O(exp(b))`, `L=exp(b)`, `T=exp(2b)`, and
`m_b<=exp(b)+1`, this is `O(exp(-2b)+exp(-4b))`, up to smaller
logarithmic contributions, and tends to zero. All constants depend only
on the fixed source family and delta.

Since `C_b>=0`, (1) implies `B_b[N_tu]>=((log T)/8)||u||^2`.
Then (7)--(9), together with `||F_bu||^2<=sum||u_j||^2`, yield

    H_ell[J_b F_bu]
      >=[(log T)/8-rho_b-epsilon_b] sum_j||u_j||^2.

This proves (A) for sufficiently large `b`. Importantly, `C_b` was paid
once on the total physical vector, avoiding an unproved growing-rank
entrywise upper enclosure for a subtracted positive operator.

## 5. True physical complement and remaining obstruction

The accepted joint projection identity subtracts a bounded selfadjoint
operator of norm at most `2eta_ell/sqrt(3)`. Apply this identity to the
*total* vector `J_bF_bu`; do not project the prime operator separately.
The isometry of `J_b` and the Gram upper bound give (B). Positivity proves
injectivity after projection and retains dimension `r m_b`.

This is a genuine sparse coherent-span result at carriers of size
`exp(2b)`, where the crude prime norm `O(exp(b))` cannot be dominated by the
gamma size `O(b)`. It is not merely the trivial far-higher-frequency tail
obtained from the bounded prime norm at each fixed support.

However, the selected carriers are very sparse: spacing `exp(b)` tends to
infinity. No adjacent-carrier bound, exceptional-carrier bound, density or
coverage of the full physical complement, bound on the dimension of the
remaining bad space, or cofinal positive exhaustion follows. The subspaces
also need not be nested as `b` grows. The theorem neither repairs the
exceptional arithmetic directions nor controls their Schur feedback into
the retained span.

The physical superwire literature is motivation for analyzing coherent
channels, not a theorem used to transfer dynamical confinement into Weil
positivity. Norm conservation, channel intensity concentration, and weak
leakage alone would not establish the signed energy inequality.

## 6. Fixed-separation-exponent extension

The same proof works for every fixed `0<epsilon<2`, with
`L=exp(epsilon b)` and `m_b>=exp((2-epsilon)b)/4`. Choose an integer

    K>max(1/epsilon, (3-epsilon)/2, 1).

The two arithmetic row-budget exponents in (9) are respectively
`1-K epsilon` and `3-epsilon-2K`, both strictly negative. Gamma and Gram
budgets are smaller. The same floors and dimension conclusions follow,
with onset and constants permitted to depend on epsilon and its chosen
derivative order. This does NOT justify taking epsilon to zero with b,
polynomial carrier spacing, or a positive-density carrier frame.

## Integrity

The final producer note `SEPARATED_GOOD_CARRIERS_AND_SIGNED_CHANNEL_TEST.md`
was read in full and its revised Gram-kernel qualification checked. Approved
SHA256: `6d277359682bbe1af9e5ff7c3477e6a2d60941b7615f05f8cfa8d7be724510c6`.
Its finite Schur equivalence is correct under its stated positive-definite
retained block, and its normalized contraction equivalence correctly adds
positivity of the second block. The selfadjoint twin-rail Hamiltonian gives
unitary evolution without implying contraction; the Julia/Halmos construction
does presuppose contraction. The identical-intensity example correctly has
Gram spectral maxima `4/3` and `2/3`. These finite-dimensional sanity checks
do not substitute for the actual arithmetic theorem or omitted-space bounds.

Only this isolated audit note and its receipt were written. No existing
source, certificate, paper, export, PR or remote state was changed. No
numerical carrier scan, prime sweep, endpoint search, or spectral producer
was run. This review does not independently recertify the accepted whole-
even endpoint or the actual-E head action theorem; those are scoped inputs.
