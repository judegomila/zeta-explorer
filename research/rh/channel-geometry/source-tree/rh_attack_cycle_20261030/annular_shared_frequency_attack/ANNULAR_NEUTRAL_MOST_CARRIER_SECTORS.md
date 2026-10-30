# Annular shared-frequency cancellation: neutral packet sectors at most carriers

30 October 2026. **New restricted analytic theorem; independent review pending.**

## Outcome and relation to prior work

The actual neutral paired-packet problem samples primes only in a FIXED multiplicative annulus around X=exp(2b). Its coefficient square sum is O_delta(b), rather than the O(b^2) full-cutoff sum. Keeping the shared carrier frequency and applying the unconditional Montgomery--Vaughan mean-value theorem gives the following restricted improvement:

For every FIXED finite-dimensional smooth even envelope space U, at all sufficiently large b, separate actual positive packet sectors of dimension dim(U) exist for all but an O_delta(dim(U)/b) fraction of carriers t in [X,2X]. The lower floor is a fixed positive multiple of log X. Exact exponential-moment neutrality is retained. Projecting by the accepted near-null physical head preserves positive sectors with a paid joint-operator error.

This is NOT positivity of the span over different carriers, positivity on the exceptional carriers, a bound on their local negative charge, a rank/coverage theorem, or a new whole-even endpoint. The earlier independently audited EVEN_PACKET_MEAN_SQUARE_AND_CROSS_BLOCK_TARGET.md already proves a generic most-carrier packet theorem and explains its cross-block obstruction. The new refinement is the fixed-annulus O(b) variance, exact-neutral small-window realization, simultaneous fixed-envelope-family bound, and its physical-complement transfer. No generic most-carrier concept is claimed as new.

## 1. Actual signed frequency symbol and the constraint

Fix 0<delta<(log2)/2. Let E_delta=L2_even((-delta,delta)), zero-extended, and use unitary angular Fourier transform V_delta. Its range is the even Paley--Wiener space of entire Fourier transforms of physical functions supported in [-delta,delta]. These functions are NOT also compactly supported in frequency.

Write

    c(x)=cosh(x/2), m(psi)=<c,psi>,
    Q_m=I-|c><c|/||c||^2,
    A=H_delta=Gamma_(1/4)+2|c><c|.

The inner product is conjugate-linear in its first entry. Exact neutrality m(psi)=0 is equivalent to (V_delta psi)(i/2)=0, with factor m(psi)=sqrt(2pi)(V_delta psi)(i/2). Evenness gives the same zero at -i/2. In frequency coordinates the neutral projector is

    V_delta Q_m V_delta* = P_PW - |V_delta c><V_delta c|/||c||^2.

No sharp frequency cutoff is assumed to commute with this projector.

For b>delta put X=exp(2b), s_n=log n-2b, and retain all actual prime powers with |s_n|<2delta. Put

    a_n=Lambda(n)/sqrt(n), M_b=sum a_n,
    Z=4sinh(delta),
    kappa_delta(t)=integral_(-2delta)^(2delta) cosh(s/2)cos(ts)ds
      =[sinh(delta)cos(2delta t)+2t cosh(delta)sin(2delta t)]/(t^2+1/4),
    S_b(t)=sum a_n cos(t s_n)-(M_b/Z)kappa_delta(t).       (1)

The reference density is a probability density after division by Z, so |S_b(t)|<=2M_b. If M_b=0 use S_b=0. The previously proved mass-matching identity gives the EXACT neutral operator equality

    Q_m Delta_b Q_m=Q_m V_delta* M_(S_b) V_delta Q_m.      (2)

Away from neutrality there is the additional scalar port (M_b/Z-exp(b))|m|^2. Formula (2) does not replace actual arithmetic by a continuous main term.

For a symmetric finite frequency band B_R=[-R,R], the exact compressed split is

    Q_m Delta_b Q_m = D_(b,R)+D_(b,>R),
    D_(b,R)=Q_m V_delta* 1_(B_R) M_(S_b) 1_(B_R) V_delta Q_m. (3)

The complement term uses 1_(B_R^c) in the same formula. There are no multiplier cross terms, but neither cutoff output is separately a supported neutral envelope. In particular the kappa contribution is not zero separately on the two frequency bands. D_(b,R) is compact (indeed Hilbert--Schmidt on the finite physical interval); (3) is a genuine band-limited compression, not a false simultaneously compact-support/bandlimited vector. The all-frequency (2) is bounded at each fixed b but requires its full tail.

## 2. Fixed smooth families and exact neutral modulation

Fix a complex r-dimensional subspace U of C_c^infinity((-delta,delta)) consisting of reflection-even functions. Choose an orthonormal basis in physical L2. Fix an even chi in C_c^infinity((-delta,delta)) with m(chi)!=0. For u in U and t>0 define

    N_t u(x)=u(x)cos(tx)-alpha_t(u)chi(x),
    alpha_t(u)=m(u cos(t .))/m(chi).                      (4)

Every N_tu is exactly neutral and lies in the actual smooth core. U and chi are FIXED as b,T grow. Constants and onset thresholds below may depend on their smooth seminorms. No free growing-r or growing-envelope-family statement is asserted.

Repeated integration by parts and cos^2(tx)=(1+cos(2tx))/2 give, for every K,

    |alpha_t(u)|<=C_(U,chi,K)t^(-K)||u||,
    ||N_tu||^2=(1/2)||u||^2+O_(U,chi,K)(t^(-K))||u||^2. (5)

The gamma multiplier has a_(1/4)(xi)=log(|xi|/(2pi))+o(1) as |xi| grows. The two translated Schwartz Fourier profiles and their rapidly small cross term yield, uniformly over u in U,

    A[N_tu]=(1/2)log t ||u||^2+O_(U,chi)(1)||u||^2.       (6)

Because m(N_tu)=0, A here is exactly the gamma form; no pole remainder is hidden in (6). To justify the uniformity, evaluate each of finitely many basis-pair entries. Translation of a Schwartz Fourier profile against the logarithmic symbol has leading log t times its L2 pairing; the two separated Fourier profiles have rapidly decreasing weighted overlap. The correction in (4) is rapidly small in the form norm as well.

For s in [-2delta,2delta], let B(s) be the compression to U of the symmetrized zero-extended shift (S_s+S_s*)/2. Then

    B(s)=B(s)*, ||B(s)||<=1, ||B(s)||_F^2<=r,
    R_u(s)=<u,B(s)u>.

Evenness makes this the same as the one-sided shift compression. Product-to-sum, followed by integration by parts in the oscillatory cross term, gives uniformly in s and u

    R_(N_tu)(s)=(1/2)cos(ts)<u,B(s)u>
                    +O_(U,chi,K)(t^(-K))||u||^2.         (7)

Define the ACTUAL matrix Dirichlet polynomial

    D_b(t)=sum_(|s_n|<2delta) a_n exp(it s_n)B(s_n),
    Re_H D_b=(D_b+D_b*)/2.                               (8)

Re_H is the Hermitian part, not entrywise real part in a complex basis. Equations (7),(8) imply

    X_b[N_tu]=(1/2)<u,Re_H D_b(t)u>
                 +O_(U,chi,K)(M_b t^(-K))||u||^2.        (9)

The common factor exp(-2ibt) in D_b is retained. It has modulus one and therefore does not affect its Frobenius mean square; no independent random prime phases are introduced.

## 3. Actual annular mean square: only Chebyshev plus Montgomery--Vaughan

The primary theorem used is Montgomery--Vaughan, *Hilbert's inequality*, JLMS(2)8(1974),73--82, Corollary3, equation(1.11):

    integral_L^(L+T) |sum c_n n^(it)|^2dt
       =T sum |c_n|^2+O(sum n|c_n|^2),                  (10)

with absolute constant and arbitrary finite complex coefficients. Translating the carrier interval changes only coefficient phases. The author-hosted primary PDF was reopened in this pass:
https://personal.science.psu.edu/rcv4/personal/Publications/s2-8-1-73.pdf
The same exact input is already pinned by the repo's sharper finite-height moment audit. No finite-time Gaussian law or RH is used.

Chebyshev's psi(Y)<=C Y suffices for all coefficient bounds here. Since the labels lie in [Xexp(-2delta),Xexp(2delta)],

    sum a_n^2=sum Lambda(n)^2/n
      <= [(log X+2delta)/(Xexp(-2delta))] psi(Xexp(2delta))
      <=C_delta(b+1),
    sum n a_n^2<=C_delta X(b+1),
    M_b<=C_delta exp(b).                                (11)

This is the important fixed-annulus saving: no full-cutoff sum of size b^2 occurs. Prime powers are included, using only Lambda(n)<=log n.

Apply (10) entrywise to sum a_n n^(it)B(s_n). Sum the resulting inequalities, and use ||B(s_n)||_F^2<=r. For b>=1,

    integral_T^(2T) ||D_b(t)||_F^2 dt
          <=C_delta r(T+X)b.                           (12)

Thus the bad-carrier set

    Bad_(b,T)={t in[T,2T]: ||Re_H D_b(t)||>(1/2)log T}

satisfies

    |Bad_(b,T)|/T
       <= C_delta r b/(log T)^2 (1+X/T).                (13)

The factor is r, not r^2: the Frobenius matrix sum was bounded before applying Markov. Bounds over the complex envelope coefficients are simultaneous on each good carrier; no net argument or separate diagonal-only positivity is substituted.

## 4. Actual positive paired sectors and their frequency range

Set ell=b+2delta and use the physical isometry

    J_b psi=[psi(.+b)+psi(.-b)]/sqrt(2).

The support lies strictly inside (-ell,ell). The reviewed exact paired identity is

    H_ell[J_b psi]=A[psi]-Delta_b[psi]-C_b[psi],
    0<=C_b<=epsilon_(b,0)I,
    epsilon_(b,0)=2delta exp(-5(b-delta))/(1-exp(-4(b-delta))).

For psi=N_tu, Delta_b[psi]=X_b[psi] EXACTLY. If T>=X/b and b is sufficiently large, then M_b T^(-K) tends to zero already for fixed K>=1, uniformly in t in[T,2T]. The cross-Gram norm above tends to zero as well. For t outside Bad_(b,T), (6),(9) therefore give

    H_ell[J_b N_tu]
       >=[(1/4)log T-C_(U,chi)-o(1)]||u||^2
       >=(1/8)log T ||u||^2.                            (14)

At the same onset, (5) gives

    (1/4)||u||^2<=||N_tu||^2<=||u||^2.

Thus J_b N_tU is an r-dimensional ACTUAL even positive sector, with physical L2 floor at least (log T)/8. It contains arbitrary complex linear combinations at THIS carrier t, including all internal cross terms.

Consequences, always for fixed delta,U,chi and sufficiently large b:

- At T=X, the good-carrier fraction is at least 1-C_delta r/b.
- For 0<epsilon<1 fixed, T=X/b^(1-epsilon) gives good fraction 1-O_delta(r b^(-epsilon)).
- More generally T>=X/b and Tb/X->infinity gives good fraction tending to one for fixed r.
- At T=K X/b with fixed K, (13) gives only O_delta(r/K)+o(1) bad fraction. A sufficiently large fixed K depending on delta,r guarantees a positive fraction (for example at least half), but not density one at that scale.

The onset in (14) depends on U,chi. The estimate is not uniform over arbitrarily growing smooth families. At the natural scale T comparable to X/b with unprescribed constants, the mean-square argument alone need not even give a nonvacuous proportion.

## 5. Transfer to the TRUE physical complement

Let P_ell be the accepted finite physical actual-E head, ran(P_ell) subset Dom(H_ell), with ||H_ell P_ell||<=eta_ell=O(ell^(-2)). Let Q_ell=I-P_ell. The separately reviewed sharp joint correction is

    ||P_ell H_ell+H_ell P_ell-P_ell H_ell P_ell||
         <=2eta_ell/sqrt(3).

Applying it to the actual smooth paired vectors, not to separate prime terms, gives on every good carrier

    H_ell[Q_ell J_b N_tu]
       >=[(1/8)log T-2eta_ell/sqrt(3)]||u||^2
       >=(1/16)log T ||u||^2                           (15)

for sufficiently large b. Since ||Q_ell J_b N_tu||<=||u||, this proves a physical floor at least (log T)/16 on the r-dimensional projected sector. Positivity in (15) proves injectivity of Q_ell J_b N_t on U.

This is the actual physical orthogonal complement, not a substituted gamma-coordinate projector. Physical projection may destroy the envelope moment representation; (15) is justified by the JOINT H correction and does not reapply the neutral prime formula to the projected vector. All projected vectors remain in the actual operator/form domain.

## 6. Exact limitations and the next missing estimate

The set of good carriers is a continuum of labels, not a common orthogonal spectral basis. The theorem proves separate finite-dimensional sectors only. Even positivity of every such sector would not prove positivity of their algebraic span without signed cross-carrier control. Here the exceptional set is also nonempty in general and has potentially large absolute measure, despite small relative measure. Its amplitude, local concentration, spectral rank and Schur feedback are not bounded by (13).

This is why the result does not revive the refuted clipped-negative aggregate or constant gamma-complement hypotheses. Nor does it contradict the actual finite-head prime-norm recurrence obstruction: that obstruction can live on rare or very late carriers, and it is not a negative H statement.

A concrete next obligation is a signed cross-carrier/exceptional-sector estimate on actual neutral packets, with real physical Gram and action norms. The prior most-carrier note already identifies the analogous adjacent-block problem. The present annular saving improves the typical diagonal-block scale but does not remove those off-diagonal blocks. No claim of a cofinal positive exhaustion, whole complement floor, new endpoint, zero-free region, or RH follows.

No numerical carrier scan, support sweep, full producer, PR/source-head modification, or remote write was performed. The theorem uses the exact actual finite prime inventory, the already audited gamma and paired-domain normalization, Chebyshev, and the stated primary mean-value theorem.
