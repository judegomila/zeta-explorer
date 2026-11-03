# Critical independent audit: finite positivity through degree 30 billion

Date: 2026-11-03. Verdict: **PASS for the 10^10 version and the stronger degree <=3*10^10 version**, as a consequence of the published Platt–Trudgian finite-height theorem and the independently checked bounds described below. This is not a fresh replication of Platt–Trudgian's computation, nor an all-degree/RH theorem.

Reviewed author note: /workspace/shared/sparse_exception_bridge_nov03/VERIFIED_ZERO_FINITE_DEGREE.md.
Independent replay files: verified_zero_degree_replay/core_iv.txt, check_constants.py, constants.txt.
Separate independently derived envelope audit: UNIFORM_GAMMA_ENVELOPE_AUDIT.md.

## 1. Published external dependency and zero-pair sign

Independently read the primary paper https://arxiv.org/pdf/2004.09765 and checked its theorem statement. Platt and Trudgian's Theorem 1 gives height 3,000,175,332,800; the paper explicitly states the weaker 3*10^12 conclusion used here. The journal record is https://doi.org/10.1112/blms.12460. This audit relies on that published rigorous computational theorem. It does not rerun its original large calculation or require individual zero ordinates.

With s=1/2+a+it, the real-part logarithmic derivative is the convergent real sum of (sigma-beta)/|s-rho|^2 over nontrivial zeros. One way to justify its constant and grouping is the even canonical product of xi about 1/2: zeros occur in opposite pairs, the possible linear exponential is excluded by evenness, and paired logarithmic derivatives converge. Real parts decay like O(1/gamma^2), allowing reflection pairing. For the two horizontal partners 1/2±d+i gamma, direct addition gives

2a[a^2+(t-gamma)^2-d^2]/([(a-d)^2+(t-gamma)^2][(a+d)^2+(t-gamma)^2]).

For a>0 this is negative only if d>a and |t-gamma|<sqrt(d^2-a^2)<1/2. Critical-line contributions are nonnegative. All zeros through |gamma|<=3*10^12 are on the critical line; zeros beyond that height are farther than 1/2 from every |t|<=H=2.9*10^12. Thus every paired contribution is nonnegative there. Multiplication by 4|xi(s)|^2/a gives Lambda_a>=0 on [-H,H]. At zeros use the entire completed expression; no division through a zero is required. At a=0 use pointwise normalized continuity. Real xi has no real zero, by its positive theta integral, so no gamma=0 exception enters.

This argument is an exact consequence of the verified finite zero height, not an inference that unknown high zeros lie on the line.

## 2. Fresh central-certificate replay and analytical conversion

Read and freshly executed only the owned script quad/independent_ivtheta_cert.py. The directed interval outputs reproduce:
xi(1/2)>0.4949;
c*=4 integral u^2 Phi(u)du>0.0228;
A2<0.02351;
A4<0.003064;
A0=xi(1)=1/2 exactly.
The A2/A4 upper bounds include all omitted positive modes and the spatial tail. For n>=3, n^2-9>=n-3 and exp(pi)>20 give sum n^4 exp[-pi(n^2-9)]<100. The resulting upper errors are <6.059e-14 and <2.737e-16 for A2/A4. For n=1,2 beyond u=2, the script's explicit exponential integral bounds are <4.6e-69. Lower xi and c* require no omitted-mode subtraction because all actual summands are positive.

For q_a(t)=Re[xi'(s) conjugate xi(s)], q_0(t)=0 and
partial_a partial_t^2 q_a=-Re[xi'''' conjugate xi]+|xi''|^2.
The theta representation gives Re xi''>=cL-A4U t^2/2 and xi'(sigma)>=a c*, xi(sigma)>=xi(1/2). Integrating the signed lower bound twice in t and once in a yields the author's improved core polynomial/integral lower bound. On 0<=v<=3.8 its retained square has a nonnegative lower base. Concavity bounds the full interval by endpoints.

A new exact-rational checker independently verifies the retained endpoint at 4.3 is
6299958915587/3662109375000000 > 0.00172,
with the zero endpoint larger. Hence Lambda_a>0.00172 on [-4,4] uniformly for normalized 0<=a<=1/2. The fresh script output and rational check are saved, rather than merely trusting the earlier PASS label.

## 3. Uniform tail envelope, including the normalized endpoint

A separate independent analytical derivation checked the pole-cancelled cell factorization xi=KP and all constants, without numerical source-code import. The resulting bounds are
|xi|<4 U^4 E, |xi'|<22 U^4 E, |xi''|<130 U^4 E,
U=1+|t|, E=exp(-pi|t|/8), 1/2<=sigma<=1.
Rotated Gamma integral bounds 6,30,170 and all s/2 chain factors were checked. In particular the product bound for xi'' is 129.9<130. Cell derivatives through order two converge normally and obey the stated bounds.

Since q_0=0 and partial_a q_a=Re(xi'' conjugate xi)+|xi'|^2, the fundamental theorem of calculus gives
|Lambda_a(t)|<=4(130*4+22^2)U^8 E^2=4016 U^8 exp(-pi|t|/4).
Thus the advertised weaker constant 4100 is valid uniformly, including a=0 by its normalized limit. There is no unbounded 1/a loss left in the proof. Full details are in UNIFORM_GAMMA_ENVELOPE_AUDIT.md.

## 4. Polynomial inequalities and exact large-degree arithmetic

For a real polynomial of degree n, the orthonormal Legendre basis on [-4,4] has kernel sum <=(n+1)^2/8, since |P_j(x)|<=1 on [-1,1]. Therefore sup_core |p|^2<=(n+1)^2/8 integral_core p^2. Chebyshev's exterior extremal inequality gives |p(t)|<=sup_core|p| |T_n(t/4)| for |t|>=4. Its elementary bound is even stronger than the deliberately loose [2(1+|t|)]^n factor used in the note. No real-root, monicity, prefix positivity, or knowledge of coefficients is needed.

Let k=2n+8 and c=pi/4. When H>=2k/c, the logarithmic derivative of (1+t)^k exp(-ct) is at most -c/2 on t>=H. Integrating both tails produces exactly
E_n=(2050/c)(n+1)^2 4^n(1+H)^(2n+8) exp(-cH).
The factor 2050/c includes both tails and the Legendre factor 1/8 correctly.

The new rational checker verifies the conservative inequalities c>3/4, log(10)<12/5 (the latter via a positive rational exponential Taylor lower bound), the cutoff derivative condition, and the large integer arithmetic. For n<=3*10^10 and H=2.9*10^12:
log E_n < (27n+130)*2.4 -0.75H <= -230999999688 < -2*10^11.
For n<=10^10 and H=10^12, the corresponding upper bound is -101999999688 < -10^11. Thus both versions have substantial arithmetic slack. No giant moment matrix was computed.

## 5. Result, complex coefficients, and comparison with earlier scope

Combining the positive core, nonnegative middle and absolute tail yields, for every nonzero real polynomial of degree <=3*10^10 and normalized a in [0,1/2],

integral_R p(t)^2 Lambda_a(t)dt
> [0.00172-exp(-2*10^11)] integral_[-4,4] p(t)^2dt >0.

For complex p apply this real inequality to its real and imaginary coefficient polynomials and add. The correct extension is integral |p|^2 Lambda_a, with the same lower bound involving |p|^2; no order relation is asserted for the complex bilinear expression integral p^2 Lambda_a.

For a>=1/2, the already independently established outer-strip argument applies at global spatial cutoff H_spatial=0: all nontrivial zeros satisfy |beta-1/2|<1/2, so every reflected contribution to Re xi'/xi is strictly positive and xi is nonzero there. This gives strict polynomial positivity at all degrees in that outer regime. Combining it with the present theorem genuinely extends the earlier global full-shift H10 scope to all polynomial degrees <=3*10^10, for every a>0 and the normalized a=0 endpoint. The explicit quantitative core/tail lower bound above is claimed only on a in [0,1/2].

Frequency t here is the xi ordinate in F(t)=2xi(1/2+it). Some earlier bridge Fourier formulas use frequency 2t; that changes moment coordinates by a positive diagonal congruence, not polynomial degree or positivity. There is no hidden doubling of the Platt–Trudgian zero height in this proof.

This result is for the global bridge, not the spatially truncated H>0 families previously checked by slab certificates. It does not supersede their additional spatial-cutoff scope. It is a very large but finite positivity corollary of published verified zeros plus full-theta bounds, not RH, all-degree positivity, a newly verified zero height, or a novelty claim about the literature. The external zero computation is an explicit dependency; all new implications, constants, polynomial steps, and the small owned core certificate have been independently checked here.
