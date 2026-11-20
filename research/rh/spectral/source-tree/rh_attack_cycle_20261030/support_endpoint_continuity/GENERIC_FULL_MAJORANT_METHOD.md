# Complete generic-X16.001 majorant: exact retained phases and scope

> Curated source/review. Mathematical formulas and proof order are retained. Operational reviewer identifiers and private executor paths were removed; the manifest records original and published hashes. Historical receipt locations refer to the original audit layout. Current accepted scope is stated in the app module; internal review is not external peer review.

30 October2026. Fixed actual reflection-even supported problem. Mathematical/source review and complete numerical result are separate gates. This note alone asserts no new support positivity.

## Fixed inputs and exact domain

`X=16001/1000`, `lambda=sqrt(X)`, `W=log X`, N2048, J16384, L36,1000-bit Arb, zero inverse-tail anchor, no rank-one lift. The physical space and canonical form domain are the actual zero-extension even L² box and its logarithmic Fourier form domain, as in the accepted lambda4 theorem. The full actual matrix is unchanged in definition; the newly active prime-power16 is included.

`generic_actual_head_pilot.py` implements the complete generic trigonometric entry formulas. No exact-X16 quarter/half-phase shortcut survives. All36 selected prime entries at X16.001 were checked against literal translated-cosine overlap integrals, with explicit finiteness; all1089 entries of its X16 specialization overlap the accepted frozen builder. The generic full builder computes every actual b_j through16385 and every head diagonal through2048, with the same150-term exponential remainder enclosure.

The audited seventh-power weighted Schur enumeration yields whole-prime norm `<3.803639828`; the production exact rational envelope is `Pschur=380364/100000=3.80364`. The accepted gamma-remainder and even tail-trace arguments then give, for the **entire** actual tail j>N,

    D>=diag(d_j),
    d_j=a(2pi j/W)-Gamma_ref(W)-Pschur-H_K(W)/N,
    d_(N+1)>0.73118.

No sampled-row minimum is substituted for the whole-tail bound. The positive derivative of the digamma series proves d_j is strictly increasing. Positive inverse order yields `D^-1<=diag(1/d_j)`.

The coefficient decomposition is

    b_j=beta_j+e_j,
    beta_j=1/4+sum_(n=2,3,4,5,7,8,9,11,13,16)(w_n/pi)sin(2pi j log n/W),
    |e_j|<=Cbeta/j, Cbeta=13/10.

The unchanged analytic envelope is

    Cformula=(2W sinh²(W/4)+1/2+55W²/48)/pi²<1.25923<Cbeta.

Also `|beta_j|<=1/4+sum w_n/pi<1.88776`. For j>=2, `|b_j|<2.51738<3`; b1 is separately checked. Hence the production global bound is B3, not the old unsupported B2 transplant.

## 1. Complete near and far splitting

All actual coupling rows N<j<=J are included exactly with weight1/d_j. This is a split of the diagonal-inverse **upper majorant** for the true self-energy `K*D^-1K`, not an additive split of the true inverse itself.

For j>J, retain the same48 finite inverse-weight bands and final infinite plateau as the accepted endpoint. Let a_0=J<...<a_48=64J be the eight subdivisions in each of six dyadic octaves. Put

    omega_j=1/d_(a_i+1), a_i<j<=a_(i+1),
    omega_j=1/d_(a_48+1), j>a_48.

Then omega is nonnegative/nonincreasing and majorizes1/d_j everywhere. Every moment below includes these inverse weights exactly; there is no second division by a tail floor.

For complex phase r>0 and integer s>=2, define

    M_s(r)=J^(s-2) sum_(j>J) omega_j exp(2pi i j log r/W)/j^s.

M_s(1) is evaluated by the accepted weighted Hurwitz-zeta differences, including the infinite last band. For r16 and256, each finite-band difference and the infinite last term use the rigorously cached Gamma-integral tails. Their exact normalization is the one in `GENERIC_PHASE_FEASIBILITY_AND_REPAIRS.md`, equation(1).

The completed cache contains10437 scalar moments. All are enclosed with1000-bit arithmetic, a fixed950-bit quadrature goal, an explicit infinite integration-tail bound, and350-digit separate real/imag serialization. Every roundtrip contains the original ball; every restored value has at least942bits, above the fixed900-bit gate. Exact ratio/order/start/scale and primitive/source precision metadata are checked before use. The earlier900-bit quadrature-goal production attempt failed closed on an895-bit value after114 verified entries; it is preserved separately and is not a source for this full construction.

## 2. Exact rational phase algebra; no approximate alias deletion

Write

    beta_j=sum_r c_r exp(2pi i j log r/W),
    c_1=1/4, c_n=-i w_n/(2pi), c_(1/n)=conj(c_n).

The21 raw rational ratios are grouped exactly. Their convolution gives193 exact rational ratios `q_r` for beta_j². At this rational X none of the nonconstant retained channels is an exact mean. Retain

    R_AA={1,16,1/16,256,1/256},
    R_AC={1,16,1/16}.

No approximation is made to their phases, including channels near the identity. By conjugation, the retained signed AA and AC moments are

    AA_s=q_1 M_s(1)+2Re[q_16 M_s(16)]+2Re[q_256 M_s(256)],
    AC_s=(1/4)M_s(1)+2Re[c_16 M_s(16)].

Only even s2..142 enter AA; only odd s3..143 enter AC. The moment matrix dimension remains72 because these are modified moments of the same A/C feature vectors, not additional head coordinates.

Every other exact ratio remains present through a global Abel bound. Define

    C_AA=sum_(r notin R_AA) 2|q_r|/|1-exp(2pi i log r/W)|,
    C_AC=sum_(r notin R_AC) 2|c_r|/|1-exp(2pi i log r/W)|.

All denominators are explicitly verified finite and positive. In production `C_AA≈6.622990102`, `C_AC≈2.903468034`. Since omega_j/j^s is globally nonincreasing, the accepted Abel estimate is charged **once**, not once per step band:

    delta_A=L C_AA omega_first/(J+1)²,
    delta_X=L C_AC omega_first/(J+1)².

For every feature vector the omitted AA quadratic is bounded by delta_A||A||², and the omitted AC bilinear by delta_X||A||||C||. With sigma1/8,

    2 delta_X||A||||C||<=delta_X[sigma||A||²+sigma^-1||C||²].

This supplies an all-head upper bound irrespective of whether any retained phase is favorable on one selected direction.

## 3. Complete far coefficient matrix

For p,q=0..L-1 let

    H_AA[p,q]=k AA_(2p+2q+2)
              +2(1+eps)(1+1/epsb) Cbeta² M_(2p+2q+4)(1)/J²,
    H_CC[p,q]=k M_(2p+2q+4)(1),
    H_AC[p,q]=-k AC_(2p+2q+3),
    k=2(1+eps)(1+epsb), eps=epsb=1/10.

Add `k(delta_A+sigma delta_X)` to the AA diagonal and `k delta_X/sigma` to the CC diagonal. The lower-left block is the transpose. These factors follow from the principal actual coupling `sqrt2(-1)^j(b_j U_j-V_j)`, the geometric split, and the fixed beta-error Young inequality. Thus the signed mixed term and all beta-error allowances are retained exactly with the same accepted normalization.

Feature rows are

    P_(p,k)=a_k(k/J)^(2p),
    P_(L+p,k)=a_k b_k(k/J)^(2p+1),
    a_0=1, a_k=sqrt2(-1)^k for k>0.

The separate all-head geometric remainder is

    rem=4B² sum_(k=1)^N k^(4L)
        /[J^(4L+1)(4L+1)(1-N/(J+1))²]
        *(1+1/eps)/d_(J+1),

with B3. It is added as rem I. Consequently

    K*D^-1K <= K_near*diag(1/d_j)K_near + P*HP + rem I.

All 72 H pivots must be positive outward intervals before the certified factor H=FF* is used. H positivity is a numerical gate, not assumed from a partially retained covariance.

## 4. Actual whole-head sign implication

Put

    C=actual_head-K_near*diag(1/d_j)K_near-rem I,
    Q=F*P.

The unmodified accepted rank-four generator code constructs C; the shared helper's historical constant-coordinate lift is removed exactly. The full test requires both

    C>0,               I-Q C^-1 Q*>0.

Every one of2049 core pivots and72 final whitened pivots must pass. Their signs certify inertia; their minima are not interpreted as eigenvalue floors. The exact bordered Schur identity then gives `C-Q*Q>0`, hence positivity of the true whole-head Schur complement. Square completion against the actual D>0 yields full-even coercivity at this one support. Exact zero-extension nesting then extends it to smaller supports.

A33-mode dense gate and the historical exact rational vector are supplemental implementation/feasibility checks only. The old witness now has positive corrected Rayleigh about1.9573e-12; its loss of old near-null alignment is not evidence about the new worst direction. The complete2049-head gate and independent replay remain decisive.

## 5. Frozen execution interfaces

- `generic_full_inputs.py`: actual generic data, all exact-near-phase weighted moments and separated-channel error matrix.
- `certify_generic_X16001.py --small`:33-mode direct dense/generator/Schur gate.
- `certify_generic_X16001.py --witness`: actual new-support fixed rational vector test.
- `certify_generic_X16001.py`: complete2049+72 sign test.
- `GENERIC_MOMENT_CACHE_V2_META.json`, `GENERIC_MOMENT_CACHE_V2.jsonl`, `GENERIC_MOMENT_CACHE_V2_COMPLETE.json`: full validated cache.

All old accepted sources remain unchanged; numerical source/cache hashes are checked before and after every gate. This is neither an odd-sector result nor a cofinal-support theorem nor RH.
