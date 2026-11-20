# Superwire-inspired channel assembly: actual separated carriers

30 October 2026. New local analytic deduction; independent internal review pending.
This is not a transferred solid-state theorem, a new support certificate, a
whole-complement bound, or an RH result. Existing accepted/source/export files
are unchanged.

## Outcome first

The superwire picture gives a useful question: do several apparently stable
channels remain safe when they interfere? On the actual smooth neutral paired
packets, the answer is provably yes for a sufficiently separated selection of
good carriers. The previously separate positive sectors can be assembled into
ONE positive subspace, retaining every signed cross-carrier entry. At carrier
height T=exp(2b), spacing exp(b) permits at least exp(b)/4 carriers for all
sufficiently large b. Each carries any fixed r-dimensional smooth envelope
space. The resulting physical complement sector has floor at least log(T)/32.

The omitted and exceptional carriers are still uncontrolled. The selected
family is sparse, is not an exhaustive spectral basis, and moves toward high
frequencies and the physical window ends. Neither many positive directions nor
small channel leakage excludes an unseen negative direction.

## 1. Intended superwire meaning and the precise dictionary

The user's 20 January 2026 history asked to apply branched flow inside the
supercritical regime, then to use it more directly toward RH:

- [private history link omitted]
- [private history link omitted]

The associated model used bridge amplitudes B=H_(F,P) A, their intensity
|B_(j,m)|^2, and the generalized Gram pair R=A* A, E=B* B. Its labels
"persistent channel" and "superwire" referred to stable nearly extremal
singular directions. Those historical finite-model numerics are not imported
as evidence about the actual Weil form. In particular, a fixed boundary head,
uniform contraction, or RH equivalence asserted in the old discussion is not
an available theorem here.

Daza--Heller--Graf--Rasanen (PNAS 118, e2110285118, 2021) study dynamical
channeling in periodic superlattices, above potential barriers; these are not
ordinary superconducting wires. The quantum discussion already allows
eventual interchannel tunneling. Graf et al. (Entropy 26, 492, 2024) analyze
chaos-assisted dynamical tunneling between parallel superwires and a paraxial
approximation. The useful imported idea is to retain complex channel
amplitudes and quantify their coupling, not to infer positivity from
confinement. Primary sources reopened in this pass:

- https://ciqm.harvard.edu/uploads/2/3/3/4/23349210/daza2021.pdf
- https://arxiv.org/abs/2103.08943
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11203167/
- https://arxiv.org/abs/2404.19074

The exact present dictionary is:

- channel input: a smooth exact-neutral modulated envelope N_t u;
- two physical rails: J_b psi=[psi(.+b)+psi(.-b)]/sqrt(2);
- arithmetic bridge: all actual weighted shifts at s_n=log n-2b;
- channel energy: the FULL polarized signed form, not intensity alone;
- tunneling/cross-talk: its off-diagonal carrier blocks;
- a useful test: a lower bound for the full Gram-normalized block matrix,
  followed by the genuine physical-head projection and omitted-space Schur
  payment.

There is no established unitary equivalence to a smooth periodic Schrodinger
operator, Mathieu equation, or random medium. No random prime phases, universal
branching exponent, automatic passivity, or zero-pressure continuation is used.

## 2. Actual objects and diagonal input, rederived

Fix 0<delta<(log 2)/2 and a complex r-dimensional reflection-even
U subset C_c^infinity((-delta,delta)). U is fixed throughout. Fix an even
chi in the same core with m(chi) nonzero, where

    m(psi)=integral cosh(x/2)psi(x) dx,
    N_t u=u(x)cos(tx)-[m(u cos(t .))/m(chi)]chi(x).

These are exactly neutral, not approximately so. For every fixed integer K,
their correction coefficient is O_(U,chi,K)(t^-K)||u||. Put T=X=exp(2b),
ell=b+2delta, and use the actual paired identity

    H_ell[J_b psi]=A[psi]-Delta_b[psi]-C_b[psi],
    A=Gamma_(1/4)+2|c_(1/2)><c_(1/2)|,
    Delta_b=X_b-exp(b)|c_(1/2)><c_(1/2)|,
    X_b=(1/2)sum_(|s_n|<2delta) a_n(S_(s_n)+S_(s_n)*),
    a_n=Lambda(n)/sqrt(n), s_n=log n-2b,
    0<=C_b<=epsilon_b I,
    epsilon_b=2delta exp(-5(b-delta))/(1-exp(-4(b-delta))).       (1)

All actual prime powers are retained. On neutral inputs and their polarized
pairings, Delta_b=X_b and A=Gamma_(1/4). Every later sum remains neutral.

Let B(s) be the compression to U of the symmetrized zero-extension shift.
It is Hermitian with operator norm at most 1 and Frobenius norm squared at
most r. Product-to-sum and uniform integration by parts give

    A[N_tu]=(1/2)log t ||u||^2+O(1)||u||^2,
    X_b[N_tu]=(1/2)<u,Re_H D_b(t)u>+O_K(M_b t^-K)||u||^2,
    D_b(t)=sum a_n exp(it s_n) B(s_n), M_b=sum a_n.              (2)

Re_H is the Hermitian part. The common phase exp(-2ibt) is retained.
Chebyshev's bound psi(Y)=O(Y), Lambda(n)<=log n and the FIXED annulus give

    sum a_n^2=O_delta(b), sum n a_n^2=O_delta(Xb),
    M_b=O_delta(exp(b)), b>=1.                                (3)

Montgomery--Vaughan, Hilbert's inequality (1974), Corollary 3, equation
(1.11), gives for finite arbitrary complex coefficients

    integral_T^(2T)|sum d_n n^(it)|^2 dt
       =T sum |d_n|^2+O(sum n|d_n|^2).

Applied entrywise and then summed, this gives

    integral_T^(2T)||D_b(t)||_F^2dt <= C_delta r(T+X)b.         (4)

Primary source: https://personal.science.psu.edu/rcv4/personal/Publications/s2-8-1-73.pdf

Consequently the closed measurable good set

    G_b={t in[T,2T]: ||Re_H D_b(t)|| <= (1/2)log T}

has measure at least T(1-C_delta r/b). Since r and U are fixed, eventually
|G_b|>=T/2. Equations (1)--(3), with gamma's logarithmic asymptotic and its
Schwartz translated envelopes, imply simultaneously for all u in U and
t in G_b, for sufficiently large b,

    H_ell[J_b N_tu] >= (log T)/8 ||u||^2.                     (5)

This is the already identified annular good-carrier input. Constants and
onset depend on delta,U,chi; (5) is not uniform over arbitrary growing U.

## 3. Full cross-carrier bounds, before any row sum

For t,s in[T,2T], every K>=1, and u,v in U, there are constants independent
of b,t,s,h with

    |<N_tu,S_h N_sv>|
       <= C_K[(1+|t-s|)^-K+T^-K] ||u|| ||v||,                (6)
    |Gamma_(1/4)[N_tu,N_sv]|
       <= C_K log T[(1+|t-s|)^-K+T^-K] ||u|| ||v||.         (7)

Equation (6) is uniform in |h|<=2delta. Indeed the uncorrected product is a
sum of four integrals with phases (plus/minus t plus/minus s)x and a
unit-modulus h-dependent factor. The amplitude is a product of two shifted
smooth compact functions, whose derivative L1 bounds are uniform in h.
Integration by parts gives decay at |t-s| and t+s. The neutral correction
has size O_K(T^-K); its two cross contributions and square obey the displayed
bound. The same argument with h=0 gives the physical Gram estimate.

For (7), |a_(1/4)(xi)|<=C log(e+|xi|). The Fourier profiles of u cos(tx)
and v cos(sx) are Schwartz functions centered at plus/minus t and plus/minus
s. For centers p,q in[-2T,2T], use

    log(e+|xi|)<=C log T+log(1+|xi-p|)

and the rapid-decay weighted convolution estimate. For every K it bounds
the weighted overlap by C_K log T (1+|p-q|)^-K. Equal-sign centers give
|t-s|; opposite signs give t+s>=2T. Corrections against chi obey even
stronger rapidly decreasing estimates (or Cauchy--Schwarz in the positive
logarithmic norm together with the arbitrarily rapid correction coefficient).
Increasing the initial decay order absorbs logarithmic factors and yields
(7). No derivative of the digamma multiplier is assumed.

Let F_b=A-X_b on the neutral core. Combining (6),(7) with the FULL finite
prime inventory proves the off-diagonal block estimate

    |F_b[N_tu,N_sv]|
       <= C_K(log T+M_b)[(1+|t-s|)^-K+T^-K]||u||||v||.      (8)

This uses an absolute bound only AFTER the carrier oscillation has produced
rapid separation decay. It does not replace diagonal signed prime
cancellation by the catastrophic M_b bound.

## 4. A common large positive span

Take L=exp(b). Select a maximal L-separated subset {t_1,...,t_m} of G_b.
Compactness gives a finite maximal selection. Its L-neighborhoods cover
G_b, and its points lie in an interval of length T. Hence

    T/(4L)<=m<=T/L+1.                                      (9)

For every increasing L-separated set and K>1,

    max_j sum_(k!=j)(1+|t_j-t_k|)^-K <=2 zeta(K)L^-K.

Thus the norm of the off-diagonal block form from (8), acting on the direct
sum of the m copies of U, is at most

    E_b=C_K(log T+M_b)[2zeta(K)L^-K+m T^-K].                (10)

This follows by the Schur row-sum test on block operator norms, or by
2||u_j||||u_k||<=||u_j||^2+||u_k||^2. It applies to arbitrary complex
coefficients across ALL the selected carriers, not merely separate vectors.
At K=3, (3),(9) give E_b=O(exp(-2b))+O(exp(-4b)) plus smaller logarithmic
terms, and hence E_b tends to zero.

Put Psi=sum_j N_(t_j)u_j and S=sum_j||u_j||^2. The same Gram argument, using
||N_tu||^2=(1/2)||u||^2+O_K(T^-K)||u||^2, gives eventually

    (1/4)S <= ||Psi||^2 <= S.                              (11)

For the diagonal of F_b, (1),(5) and C_b>=0 give
F_b[N_(t_j)u_j]>=log(T)||u_j||^2/8. Subtract C_b ONCE on the total Psi:

    H_ell[J_b Psi]
      >=[(log T)/8-E_b]S-epsilon_b||Psi||^2
      >=(log T)/16 S                                     (12)

eventually. This avoids a hidden m-fold charge for C_b. By (11), the
subspace has dimension rm and actual physical floor at least log(T)/16.

If P_ell is the accepted finite physical actual-E head with
||H_ell P_ell||<=eta_ell=O(ell^-2), Q_ell=I-P_ell, the independently reviewed
joint correction bound gives

    |H_ell[Q_ell f]-H_ell[f]|<=2eta_ell||f||^2/sqrt(3).

Apply this ONCE to f=J_b Psi. Equations (11),(12) imply

    H_ell[Q_ell J_b Psi] >= (log T)/32 S
                       >= (log T)/32 ||Q_ell J_b Psi||^2.   (13)

Positivity establishes injectivity, so the projected subspace also has
dimension rm. Its vectors are in the actual physical complement and form
domain. Projection need not preserve the envelope moment; the joint H
correction, not a reapplication of the neutral prime formula, proves (13).

Optional fixed-epsilon variant: L=exp(epsilon b) for any FIXED 0<epsilon<2
gives m>=exp((2-epsilon)b)/4. Choose an integer
K>max(1,1/epsilon,(3-epsilon)/2). The two arithmetic row terms in (10) are
O(exp((1-K epsilon)b)) and O(exp((3-epsilon-2K)b)), both vanishing. The same
conclusions follow, with onset now depending on epsilon and required smooth
seminorms. No uniform epsilon-down-to-zero, growing-envelope, or dense
carrier statement follows.

## 5. A falsifiable channel test, and what would close the blocker

For any linearly independent proposed neutral carrier collection at one b
(or after first quotienting its Gram kernel), form its actual positive
physical Gram G and the FULL Hermitian signed matrix

    Z_ij=A[psi_i,psi_j]-<psi_i,Delta_b psi_j>-C_b[psi_i,psi_j].

An independently enclosed lower bound on

    lambda_min(G^(-1/2) Z G^(-1/2)) - 2eta_ell/sqrt(3)       (14)

tests whether the WHOLE chosen channel family remains positive after the
true physical projection. The upper bound for subtracted C_b must include
its positive tail. A nonpositive value can reject a proposed certificate;
only an actual negative Rayleigh enclosure establishes a negative vector.
The theorem above supplies an asymptotic analytic PASS for a sparse
selection. It does not certify neighboring/exceptional carrier collections.

For a finite orthogonal channel decomposition, write the physical signed
matrix as [[D,B],[B*,E]], with D the certified positive channel block. Exact
completion of the square gives

    H>=0  iff  E-B*D^(-1)B>=0.                             (15)

If E>0 is independently established, the remaining test is
||D^(-1/2)B E^(-1/2)||<=1. The associated twin-rail Hamiltonian
[[0,C],[C*,0]] with C=D^(-1/2)B E^(-1/2) is selfadjoint and generates
lossless evolution for EVERY C; this conservation does NOT prove ||C||<=1.
A Julia/Halmos lossless dilation requiring sqrt(I-C*C) assumes the desired
contraction and cannot prove it. For an infinite omitted space, (15) needs
the corresponding closed-form/domain and bounded inverse/coupling
hypotheses; none is silently asserted here.

An exact sanity check shows why intensity alone cannot decide (14): the
two matrices (1/sqrt(3))[[1,1],[1,1]] and
(1/sqrt(3))[[1,1],[1,-1]] have identical entrywise squared magnitudes.
Their Gram top eigenvalues are respectively 4/3 and 2/3. Thus I-B*B is
indefinite in the first case and positive in the second. Phases and coherent
cross terms are indispensable. This is an abstract diagnostic, not a Weil
counterexample.

The global blocker is still (15) on ALL omitted directions, with the signed
actual prime term, physical Gram and correct physical head. In particular:

- the good set excludes some carriers, and spacing discards many good ones;
- this gives no low-dimensional description of exceptional channels;
- near-carrier interactions need not have the useful separation factor;
- spatial tightness, low-frequency coverage and cofinal exhaustion do not
  follow from the large dimension in (9);
- none of the already refuted clipped-excess/constant-gap shortcuts is
  revived.

The valid improvement is common sparse-channel assembly, not a whole-even
support extension. No numerical carrier scan, spectral/endpoint sweep,
producer run, app/PR edit, or remote write was performed.
