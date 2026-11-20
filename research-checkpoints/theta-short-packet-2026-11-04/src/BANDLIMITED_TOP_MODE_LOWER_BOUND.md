# A theta-specific top-frequency lower bound, with finite-band conditioning

Date: 2026-11-04. This note proves a finite-band Fourier inequality for the frozen Riemann–Siegel sum and an unconditional actual-Hardy-Z version for each fixed, sufficiently decaying finite-dimensional band-limited envelope space. The actual transfer uses a dual test and scalar Riemann–Siegel errors, never differentiation of an O-remainder. The companion frequency audit independently proves an actual polynomial-packet lower bound. These are **absolute derivative-energy lower bounds**, not derivative/mass ratio estimates and not selected coherence. No RH, signed-form positivity, inverse old gap, or division by Xi is used.

## 1. Why the top mode does not require an extremely narrow envelope

Let the unitary Fourier transform be used throughout. For B>0, let PW_B consist of the L² functions whose Fourier transforms are supported in [−B,B]. For T large, put

    N=floor sqrt(T/(2π)),  λ=θ′(T),
    c_m=m^(−1/2) exp(−iT log m),
    D_T(u)=exp(iθ(T)) Σ_(m≤N)c_m exp(i(λ−log m)u)
           +exp(−iθ(T)) Σ_(m≤N)conj(c_m) exp(−i(λ−log m)u).

Thus D_T is the real frozen Riemann–Siegel trigonometric sum. Stirling's formula gives λ=(1/2)log(T/(2π))+O(T^(−2)) and λ−log N≥−O(T^(−2)).

Fix B before taking T to infinity. Define

    L_B=Σ_(2≤m≤exp(2B)) m^(−1/2),
    J_B=floor(2B/log 2)+1,
    K_B=Σ_(j=0)^(J_B−1) L_B^j.

Empty sums have their usual value, so L_B=0 and K_B=1 when 2B<log 2. These constants can be very large for large B; no uniformity in B is asserted.

**Finite-band theorem.** For all sufficiently large T, depending on B, and every g∈PW_B,

    ||g D_T′||²_(L²(R)) ≥ λ²/(4K_B²) ||g||²_(L²(R)).       (1.1)

One sufficient threshold, in addition to N≥exp(2B), is

    λ>2B+1,  λ≥4B L_B K_B.                                (1.2)

The second condition is vacuous if L_B=0. This theorem permits g to depend arbitrarily on T. It does not require g to be real or positive.

### Proof

Inspect the Fourier transform of gD_T′ on the top-frequency interval

    I_T=[λ−B,λ+B].

The negative-frequency Riemann–Siegel branch has support at most B+O(T^(−2)), so it is disjoint from I_T once (1.2) holds. After translating I_T down by λ and dropping the harmless phase i exp(iθ(T)), the remaining transform is

    [λ(I+K)−R] ĝ,                                        (1.3)

on [−B,B], where

    (S_a f)(ξ)=f(ξ+a),  with f extended by zero off [−B,B],
    K=Σ_(2≤m≤exp(2B)) c_m S_(log m),
    R=Σ_(2≤m≤exp(2B)) (log m)c_m S_(log m).

Terms with log m>2B have no overlap with this interval. Boundary-point overlap has measure zero and is irrelevant in L².

Every S_a is a contraction. Moreover, products of J_B shifts in K move the argument by at least J_B log 2>2B. Consequently K^(J_B)=0 exactly. Hence

    (I+K)^(−1)=Σ_(j=0)^(J_B−1)(−K)^j,
    ||(I+K)^(−1)||≤K_B,
    ||R||≤2B L_B.

For all f∈L²[−B,B],

    ||[λ(I+K)−R]f||
        ≥ (λ/K_B−2B L_B)||f||
        ≥ λ/(2K_B)||f||.

Plancherel and restriction to I_T prove (1.1). The argument retains all overlapping top modes; their cancellation is controlled by a finite nilpotent triangular system. Thus the simpler isolated m=1 argument is not restricted to B<log 2/2 in principle. The price is the explicit B-dependent conditioning K_B.

## 2. Exact hypothesis for transfer to actual Hardy Z

Let g_T∈PW_B and suppose the actual Hardy function satisfies

    ||g_T[Z′(T+·)−D_T′]|| = o(log T)||g_T||.                (2.1)

Then the reverse triangle inequality and (1.1) imply

    liminf_(T→∞) ||g_T Z′(T+·)||² /
                    [(log T)²||g_T||²] ≥ 1/(16K_B²).      (2.2)

Indeed λ/log T→1/2, and the lower norm in (1.1) is λ/(2K_B). There is no relative approximation of Z′ by D_T at its zeros: (2.1) is an absolute weighted L² statement.

For a fixed finite-dimensional envelope space V⊂PW_B, a convenient sufficient condition for (2.1), uniformly for g_T∈V, is the following pair of estimates:

1. For some fixed η>0, on |u|≤T^η the derivative freezing error is O(T^(−a)(1+|u|)^r(log T)^b), with a>0, and every g∈V has the corresponding weighted L² moment controlled by C_V||g||².
2. On |u|>T^η, both weighted derivative tails are o((log T)²)||g||² uniformly for g∈V.

These assumptions explicitly expose the needed envelope decay. A finite-dimensional space spanned by sufficiently high powers of sinc times fixed exponentials has arbitrarily high fixed algebraic decay and bounded Fourier support. The norms of the coefficient maps and tail controls depend on the fixed Gram matrix of these envelope functions. They are not dimension-free estimates and cannot be applied to a growing, potentially ill-conditioned envelope space without new work.

The companion `SHORT_PACKET_FREQUENCY_AUDIT.md` supplies Riemann–Siegel estimates for a fixed sinc-power packet and the actual polynomial-envelope comparison. Its direct lower-bound proof uses integration by parts and does not differentiate a Riemann–Siegel O-remainder or establish (2.1). Formula (2.2) should only be invoked for an envelope family after the stated absolute weighted error has been verified. Neither the abstract Fourier calculation nor that separate integration-by-parts proof is a verification of (2.1).

### 2A. An unconditional actual-theta transfer through scalar errors

There is a weaker approximation route that can be verified directly. Let V⊂PW_B be a fixed finite-dimensional space of continuously differentiable functions for which

    |g(u)|+|g′(u)| ≤ C_V(1+|u|)^(−4)||g||₂,  g∈V.                (2A.1)

For example V can be any fixed finite-dimensional span of functions sinc(ωu)^4 exp(iν_j u), with distinct fixed real ν_j. The constant C_V includes the inverse square root of the smallest eigenvalue of their fixed L² Gram matrix. Both the bandwidth and this conditioning are fixed before T increases; this is not a statement for arbitrary growing envelope spaces.

**Actual-Hardy-Z theorem.** Uniformly for nonzero g_T∈V,

    liminf_(T→∞) ||g_T Z′(T+·)||² /
                    [(log T)²||g_T||²] ≥ 1/(16K_B²).            (2A.2)

To prove this without (2.1), first set E_T(u)=Z(T+u)−D_T(u). The standard scalar Riemann–Siegel formula and θ″(t)=O(1/t) give, on |u|≤T^(1/10),

    |E_T(u)| ≤ C[T^(−1/4)+(1+u²)T^(−3/4)].                    (2A.3)

In detail, the change of cutoff floor sqrt((T+u)/(2π)) costs at most O(1) summands there, each of size O(T^(−1/4)). The exact gamma phase differs from θ(T)+θ′(T)u by O(u²/T); multiplying by Σ_(m≤N)m^(−1/2)=O(T^(1/4)) gives the second error. This derivation does not differentiate the unknown remainder.

The same scalar formula gives the global bound |Z(t)|≤C(1+|t|)^(1/4), using evenness for negative t; also |D_T(u)|≤CT^(1/4). Thus (2A.1) and a tail split at |u|=T^(1/10), followed if necessary by |u|=T, give

    ||E_T g||₂+||E_T g′||₂ ≤ C_V T^(−1/10)||g||₂.             (2A.4)

For the local part the right side can even be O(T^(−1/4)) because the fourth weighted moment of g² and g′² is finite. For the outer part its squared bound is

    C_V||g||² ∫_(|u|>T^.1)(1+|u|)^(−8)(T+|u|+1)^(1/2)du
        ≤ C_V||g||²[T^(1/2)(T^.1)^(−7)+T^(−13/2)]
        = O(T^(−1/5))||g||².

Let h_T be the normalized Fourier projection of gD_T′ onto I_T. The frozen theorem says this projection is nonzero and

    <gD_T′,h_T>=||1_(I_T) Fourier(gD_T′)||₂
                  ≥ λ/(2K_B)||g||₂.

Complex conjugates are understood in the inner product. Since h_T has Fourier support in I_T,

    ||h_T||₂=1,  ||h_T′||₂≤λ+B.

Integration by parts now gives

    |<g(Z′(T+·)−D_T′),h_T>|
      ≤ ||E_T g′||₂ ||h_T||₂ +||E_T g||₂ ||h_T′||₂
      ≤ C_V T^(−1/10)(1+λ+B)||g||₂.                           (2A.5)

The boundary term vanishes by (2A.1), the polynomial scalar bound for E_T, and the boundedness of a fixed-width band-limited h_T. If the actual derivative norm is infinite, the lower bound is automatic; otherwise L² duality applies directly. Combining (2A.5) with the frozen lower bound proves

    ||gZ′(T+·)||₂ ≥ [λ/(2K_B)−O_V(T^(−1/10)(1+λ+B))]||g||₂,

and hence (2A.2). All bounds are uniform in g∈V, including T-dependent choices of its coefficients.

The standard scalar input, including the floor cutoff and O(t^(−1/4)) remainder, was checked directly at NIST DLMF §25.10(ii), equation 25.10.3 and the sentence immediately following it: https://dlmf.nist.gov/25.10#E3 . Its cited source is Titchmarsh, *The Theory of the Riemann Zeta-Function*, second edition, equation (4.17.4), p.89. The equivalent approximate functional equation is https://dlmf.nist.gov/25.9#E3 . No derivative version of its remainder is an input here.

## 3. Why an absolute floor is still short of observability

The desired arithmetic ratio would be

    ||g_T Z′(T+·)||² / ||g_T Z(T+·)||² →∞.                  (3.1)

The denominator in (3.1) is absent from (1.1) and (2.2). In particular a lower bound c_B(log T)²||g_T||² cannot be divided by an unproved estimate ||g_T Z||²=O(log T)||g_T||². At fixed packet width the latter is a genuine uniform local arithmetic assertion, not the global mean-square theorem.

There are many low-frequency Riemann–Siegel terms: for a fixed R>0, indices m between exp(−R)sqrt(T/(2π)) and sqrt(T/(2π)) have |λ−log m|≤R+o(1). The spacing between neighboring frequencies there is of order T^(−1/2). A fixed-width envelope therefore does not make their weighted Gram matrix diagonal. Our top-frequency estimate neither removes nor bounds that block.

For comparison, an explicit independent route would be an absolute low-frequency estimate. Let φ be a fixed positive differentiable envelope with |φ′|≤Cφ, let f_T(u)=φ(u)Z(T+u), and set D(T)=||φ Z′(T+·)||². If

    D(T)≥c(log T)²,
    ||1_(|ξ|≤R) f̂_T||²=o((log T)²) for every fixed R,      (3.2)

then (3.1) follows for g_T=φ. To see this, put M(T)=||f_T||² and split its Fourier mass at R. Since

    ||f_T′||²≤2D(T)+2C²M(T),

we obtain

    (1−2C²/R²)M(T)
       ≤ ||1_(|ξ|≤R)f̂_T||² +2D(T)/R².

For fixed R>sqrt(2)C, divide by D(T), use (3.2), take limsup in T, and finally let R→∞. This gives M(T)/D(T)→0. This is an independently formulated **unproved** arithmetic low-pass estimate, not something deduced from the frequency list or from cumulant errors.

A suitable positive finite-band envelope is

    q(u)=sinc²(ωu)+sinc²(ωu−π/2),  φ(u)=q(u)^s,

where sinc v=sin(v)/v with its continuous value at zero. The two zero sets are disjoint, q(u) is bounded above and below by fixed positive multiples of (1+u²)^(−1), and |q′|≤C_ω q. Its Fourier support is contained in [−2ω,2ω], so φ has bandwidth at most 2sω and polynomial decay of arbitrarily high fixed order. These facts make (2.1) a concrete checkable approximation problem. They do not prove the second part of (3.2).

## 4. Relation to the actual selected problem

For the theta transform F=aZ, actual polynomial envelopes are g_n(u)=a(T_n+u)p_n(T_n+u)/a(T_n). They are not exactly band-limited. Passing from them to a fixed finite-band profile requires an absolute weighted approximation estimate, separately for Z and Z′ where each is used. The explicit Fejér packets permit such estimates at fixed profile power; arbitrary selected P_n have not been shown to do so.

Even if (3.1) were proved for a fixed packet family, the selected quantity is U_n/Δ_n, where U_n is a global old-derivative projection and Δ_n=A_n−B_n. Nothing here identifies that moving selected family with the packets, proves Δ_n>0, or supplies a rate involving the old gap ρ_n. In particular none of (1.1)–(3.2) invokes or estimates Q_old^(−1) or K_old^†.

The useful new point is a non-circular theta-specific coercive component: the top Riemann–Siegel modes cannot jointly erase the log²T derivative-energy floor for a bounded-band envelope. The remaining work is genuinely relative arithmetic control and a valid selected-family bridge.
