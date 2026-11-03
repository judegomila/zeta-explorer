# The remaining low-order/high-height wedge: exact Green–arithmetic bridge

Status: new exact identities and scoped sufficient conditions; independent review pending. No global sign assertion. Earlier v1–v4 outputs are frozen.

## 1. Two distinct high-order inputs must not be conflated

**Self-contained campaign theorem:** v4 proves the full-theta L1 bound with explicit constants. For each finite height cutoff T, it makes every sufficiently high Laguerre order positive throughout |t|<=T, with an explicit order threshold asymptotic to T²/2.

**External preprint:** bramble_trace's baseline Theorem1a states a much stronger eventual logarithmic order threshold. Its §§3–4.4 received a bounded independent two-lane argument audit; see v4/PRIMARY_CORE_AUDIT.md for exact versions, hashes, dependencies and exclusions. It is not presented as a community-established or formally verified theorem. No imported zero-free improvement is used here.

If that external baseline is taken as an attributed auxiliary result, the unresolved order-height region narrows to low orders below a fixed multiple of log|t| (with an unspecified onset). In either treatment, fixed small orders at unbounded height remain outside the high-order result. Neither result proves all-order positivity.

## 2. A rigorous finite-head reduction using only our explicit theorem

Let c=sqrt(pi)/500. For T>=0 let k_T be the unique root k>=c^(-2) of

    k log(c sqrt(k))=T².

This function is strictly increasing on that interval. Set

    N(T)=max(210000, ceil[(k_T−9)log(k_T/(4pi))/4]).

The saddle relation is n=(k_n−9)log(k_n/(4pi))/4, increasing for k_n>=90000. Therefore every n>=N(T) lies in the v4 positive band throughout |t|<=T. Also N(T)~T²/2 as T→infinity.

Define the finite polynomial in a²

    Q_N(a,t)=sum_(1<=n<N) n L_n[Xi](t)a^(2n−2).

The exact, absolutely convergent generalized-Laguerre expansion and positive high-order remainder give

    W_a(t)/a >= Q_(N(T))(a,t),   |t|<=T, a>0.               (1)

Thus a verified nonnegative finite polynomial Q_N on a compact height/shift rectangle suffices. It is not necessary to verify every coefficient separately. More flexibly, any negative finite-head value may be compared with the explicit positive reserve

    sum_(n>=N(T)) n a^(2n−2) [2^(2n)/(2n)!]250s_n²m_n.

Keeping only its first term is already a valid lower reserve. This reserve vanishes to very high order as a→0: it cannot repair a negative L_1 at that height. The finite-head reduction is consequently not a way around the low-order bottleneck.

The explicit N(T) is conservative and often impractically large. The local undivided jet certificate near a real zero is a much more efficient finite-window method. This section supplies a logical truncation with a one-sided tail, not an efficient all-height algorithm.

## 3. The exact derivative-channel kernel

Define

    C_b^[1](v)=integral_0^infinity h sinh(2bh)(h²−v²)
                         psi(h-v)psi(h+v)dh.

The two-state autocorrelation of u exp(bu)psi(u) gives

    Fourier[C_b^[1]](2t)=W_b[Xi'](t),
    C_b^[1]=(1/4)partial_b² C_b−v²C_b.                      (2)

The factor h²−v² must remain: it is negative on |v|>h. Removing it or bounding the two channels independently as positive would change the actual forcing.

For a strip 0<a<A define

    m_a,A(v)=sinh(2a|v|)/sinh(2A|v|),  m_a,A(0)=a/A,
    g_a,b,A(v)=sinh(2|v|min(a,b))sinh(2|v|(A−max(a,b))) /
                [2|v|sinh(2A|v|)],

with continuous value min(a,b)(A−max(a,b))/A at v=0. Fourier-transforming the exact strip Green formula from v3 gives

    C_a=B_a−K_a,
    B_a(v)=m_a,A(v) C_A(v),
    K_a(v)=4 integral_0^A g_a,b,A(v) C_b^[1](v)db.           (3)

For A>=1/2 the boundary kernel C_A is PD. The multiplier m_a,A is itself PD: it is the Fourier transform, after the stated scaling, of the nonnegative upper-edge strip Poisson kernel. Hence B_a is an explicit positive boundary transfer.

The remaining term K_a is the exact full signed derivative-channel cost, not a discarded tail. The sufficient relative arithmetic estimate is

    K_a <=_PD q B_a,    q<1.                                (4)

For a fixed a, (4) yields C_a >=_PD (1−q)B_a. Establishing it only for prescribed finite node sets gives only a finite Gram certificate, not full positive definiteness. If q approaches one at high frequency, a uniform strict gap cannot be silently assumed.

## 4. Direct bridge to grouped Epstein data

Inside 0<b<1/2, the original thread's exact, fully regularized Epstein identity is

    C_b=(1/128)partial_b T_b,
    T_b=[D_v²−(2b−1)²][D_v²−(2b+1)²] E(b+1/2,v).

Substitution in (2) gives the explicit grouped arithmetic forcing

    C_b^[1]=(1/512)partial_b³ T_b
             −(v²/128)partial_b T_b.                       (5)

Consequently the grouped Epstein/Ewald method can feed directly into (3)–(4), but it must control both the third shift derivative and the v²-weighted first derivative of the SAME regularized group, with every cross term and remainder retained. A bound only for T_b or its positive parent is insufficient.

At A=1/2, raw E has a meromorphic pole. The boundary C_A in (3) is evaluated from the complete theta integral; it is smooth and finite. No unregularized Epstein value or derivative is inserted at that endpoint. Interior identity (5), when used under b integration, must retain the full cancellation and an endpoint-dominating bound; theta estimates provide one safe route.

Equation (5) is the requested exact bridge between the arithmetic grouping and the Green budget. It does not itself prove (4).

## 5. A small integrated cost does not imply the required relative bound

At v=0, equation (3) has the particularly transparent identity

    K_a(0)=(a/A)C_A(0)−C_a(0)>0   (0<a<A).

Since C_a(0)/a is strictly increasing, the scalar cost fraction

    q_mass(a)=K_a(0)/B_a(0)
             =1−A C_a(0)/(a C_A(0))

decreases to zero as a→A and has limit

    q_mass(0+)=1−2A m_1/C_A(0).                             (6)

This is the total spectral-mass budget. Any relative bound (4) must have q>=q_mass(a), but this necessary scalar test is far from sufficient.

For an exact counterexample to that inference, take B(v)=exp(−v²) and K(v)=epsilon exp(−alpha v²), alpha>1, 0<epsilon<1. Both B and K are PD, K(0)/B(0)=epsilon, and even the pointwise inequality K(v)<=epsilon B(v) holds. Yet

    hat K(xi)/hat B(xi)
      =(epsilon/sqrt(alpha))exp[(1−1/alpha)xi²/4]→infinity.

Therefore B−K is not PD. Small total cost and pointwise domination can coexist with a negative high-frequency region. A phase-aware relative spectral estimate is indispensable; absolute theta tails or moment bounds alone do not supply it.

The full-theta value in (6) for A=1/2 is enclosed by the original local interval script certify_green_mass.py. Numerical results will be appended after review. This calculation quantifies the mass budget but is not evidence for (4).

## 6. What additional estimate would actually close the wedge?

There are two concretely different sufficient targets:

1. **Finite-order/height target:** prove the finite head Q_(N(T)) plus its positive tail reserve nonnegative on growing height windows, with estimates uniform as T→infinity and a→0. The leading small-a term remains L_1, so no high-order theorem removes its unbounded-height requirement.
2. **Grouped Green target:** prove that the complete arithmetic cost in (5), integrated with g, is bounded relative to the boundary transfer as in (4), either globally or over an exhaustive compatible family with controlled high-frequency tails.

The actual missing arithmetic information is localization: the forcing must not concentrate its spectral mass where the positive boundary extension is exceptionally small. The scalar mass budget, the positive parent, the finite Gram examples and the large-order Gaussian band do not prevent such concentration.

This is a precise obstruction to combining the existing mechanisms without new input. It is not a proof that no grouped estimate can work. The modular lane's finite-node relative Gram certificate is a valid scoped instance of the right type of bound, but it must not be extrapolated to arbitrary nodes or heights.

## 7. Completed total-mass enclosure (not a relative PD certificate)

The original interval Simpson run completed with 577 accepted intervals. Outward-rounded results are

    0.0159046929548757 < C_(1/2)(0) < 0.0159046929561949,
    0.01167167596 < q_mass(0+) < 0.01167167669.

Thus the exact integrated Green cost is at most about1.16717% of the boundary transfer's total spectral mass, uniformly in0<a<1/2, because q_mass decreases witha. This does NOT bound its pointwise spectral ratio. The elementary Gaussian counterexample in§5 shows why replacing a relative quadratic-form estimate by this small scalar percentage is invalid.

The script uses the already reviewed full-theta derivative enclosures, exact fourth-order product rule for h sinh(h)psi(h)², interval Simpson remainder, and complete h>=4 tail bound. Detailed interval endpoints are in green_mass_intervals.json. Independent review status is recorded in REVIEW.md when complete.

## 8. Why the high-order theorem cannot remove the small-shift wedge

For every fixed realt,

    lim_(a→0+) W_a(t)/a=L_1[Xi](t).

The positive order tail in(1) starts at a^(2N(T)−2). It cannot change this limit or compensate a negative first coefficient uniformly down toa=0. Even perfect control of every sufficiently high order therefore leaves an independent all-height obligation at small fixed orders.

The logarithmic saddle in the external preprint lies in the absolute-convergence half-plane when its order-to-height ratio exceeds1/2. Lower ratios move that saddle into the region where its Euler-product lower bound is no longer available. That is the arithmetic boundary of that particular argument, not a proved sign transition. We do not extrapolate its asymptotic formula across this boundary.

The grouped Epstein/Green method would need to replace precisely this unavailable relative control, through the fully coupled estimate(4) or a genuinely sharper local jet bound. At present the finite-node grouped Gram and local zero-neighborhood results supply scoped instances, not a uniform bound over the remaining wedge.
