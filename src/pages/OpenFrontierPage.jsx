import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';

// Constants referenced by the separate Dyson / collision-flow research lane.
const C_ASYM = 0.9027902227683418;
const C_OBSERVED_MIN = 0.9015828375;
const EXCURSION_CAP = 0.5073;
const THEOREM_A_CAP = 0.25;

const GLOBAL_FRONTIER = {
  id: 'T3',
  tag: 'twin-ladder-exact-residual',
  color: '#ef4444',
  badge: 'SOLE GLOBAL RH FRONTIER',
  title: 'T3: exact Twin Ladder residual inequality',
  status: 'OPEN · RH-EQUIVALENT',
  body: [
    'For every a > 0 and every finite test in the upper half-plane C_+, prove the ' +
    'Hermitian-form inequality D_{a,R} + K_a^(S) ⪰ -K_{a,0}. Equivalently, the ' +
    'finite matrix associated to D_{a,R} + K_a^(S) + K_{a,0} must be positive ' +
    'semidefinite for every choice of test points and coefficients.',
    'The exact kernel decomposition is K_a = K_{a,0} + D_{a,R} + K_a^(S), where ' +
    'K_{a,0} ⪰ 0 is the genuine positive core. The residual D_{a,R} has a ' +
    'second-order cancellation through cos(ps) - 1, while K_a^(S) is the second ' +
    'indefinite channel. A crude absolute-value estimate spends the entire ' +
    'positive core, so the missing step is a cancellation-sensitive ' +
    'Volterra/derivative estimate controlling both channels together.',
    'T26 sharpens the quantifier: for any prescribed positive sequence a_n → 0, ' +
    'positivity at infinitely many indices already implies RH. This replaces the ' +
    'all-thickness continuum by a discrete exact target, but does not prove one ' +
    'missing small-thickness sign. Promotable progress must supply a new zeta-specific ' +
    'lemma or rigorously refute a proposed exact-kernel bridge.',
  ],
  links: [
    { to: '/twin-ladder', label: 'Twin Ladder Explorer' },
    { to: '/closure-routes', label: 'Closure Routes' },
    { to: '/route-map', label: 'Route Map' },
  ],
};

const CHANNEL_SPLIT_CERTIFICATE = {
  status: 'RIGOROUS FINITE ALLOCATION COUNTEREXAMPLE',
  title: 'No PSD partition of the positive core repairs both channels',
  configuration: 'a = 1/4,  z = (−1/2, 0, 1/2) + i/5',
  betaR: 'βR > 1.027286016',
  betaS: 'βS > 0.42200180358',
  betaSum: 'βR + βS > 1.449287819 > 1',
  radialFullCore: 'vR*(GR + G0)vR < 0',
  compensation: '−1.5588799×10⁻⁹ + 4.1550097×10⁻⁹ = 2.5961298×10⁻⁹',
  coupledTarget:
    'Radial and shear are symmetric and skew combinations of one exact theta tensor. ' +
    'The interval-energy and finite-difference terms cancel algebraically to one real ' +
    'symmetric correlation kernel, whose parity blocks preserve the full coupling. ' +
    'Each fixed integration slice is indefinite, and a generic positive weight has an ' +
    'exact negative block, so any positivity must be theta-specific and emerge only ' +
    'after integration.',
  method:
    '256-bit Arb · exact one-dimensional Laplace-product factorization · ' +
    'combined omission error < 10⁻²² · independent acb_dirichlet_xi cross-check',
  jetConfiguration: 'a = 1/4,  z* = i/5,  Taylor jets through derivative order four',
  jetOrder2: 'inertia(J0 + JR) = (2 positive, 1 negative, 0 zero)',
  jetOrder2Rescue:
    '−6.25849035165×10⁻⁹ + 1.59019647623×10⁻⁸ ≈ 9.64347441063×10⁻⁹',
  jetOrder4: 'R = N + Q,  N ⪯ 0 has rank 4,  Q ⪰ 0 has rank 1',
  jetOrder4Rescue:
    '−0.00274013664134 + 0.00419290185547 ≈ 0.00145276521413',
  jetMethod:
    '768-bit Arb · Laplace moments through order eight · all omission bounds ' +
    '< 7.776×10⁻⁶⁹ · independent completed-ξ power-series check',
};

const ONE_POINT_JET_HIERARCHY = {
  status: 'PROVED EXACT REFORMULATION',
  title: 'One point is enough only when every jet order is controlled',
  fixedA: '∀d ≥ 0:  Jₐ⁽ᵈ⁾(z*) ⪰ 0  ⇔  Kₐ ⪰ 0 globally  (fixed a)',
  sequence: '∀n,d:  Jₐₙ⁽ᵈ⁾(z*) ⪰ 0 with aₙ ↓ 0  ⇔  RH',
  caveat:
    'The two-variable kernel is entire after its diagonal singularity is removed, so ' +
    'global Taylor convergence proves the reverse implication and confluent ' +
    'Vandermonde limits prove the forward implication. This removes the need to scan ' +
    'evaluation centers; it does not provide a finite-order bound.',
  finiteWarning:
    'A rigorous de Branges toy kernel can have a positive jet through any prescribed ' +
    'finite order at a fixed center while remaining globally negative at a distant ' +
    'upper-half-plane zero. This rules out a universal cutoff based only on entireness ' +
    'and kernel structure; it does not rule out new zeta-specific input.',
};

const MARKOV_NORMALIZATION = {
  status: 'PROVED EXACT FRONTIER MAP',
  title: 'The fixed-thickness frontier is one Wiener–Hopf phase condition',
  rowMass: 'mₐ(t) = 2(∫₀∞ Pₐ(u)du)(∫|t|∞ Qₐ(u)du)',
  equivalence: 'fixed a:  Twin Ladder positivity  ⇔  𝖯ₐ ⪰ 0 on L²(mₐ dt)',
  sameSign:
    'fixed a:  𝒜ₐ ⪰ 0  ⇔  X(w−a)/X(w+a) is Schur on Re w > 0  ⇔  full kernel PSD',
  divisor:
    'fixed a:  𝒜ₐ ⪰ 0  ⇔  m(λ) ≤ m(λ−2a) for every zero with Re λ > a',
  sequence:
    'any aₙ → 0⁺:  𝒜ₐₙ ⪰ 0 for infinitely many n  ⇔  RH',
  outer: 'unconditional outer ray:  a ≥ 1/2  ⇒  𝒜ₐ ⪰ 0 and full kernel PSD',
  halfAnchor:
    'a = 1/2:  B(w) = ξ(w)/ξ(w+1) is inner unconditionally; ordinary Clark positivity is automatic',
  poisson:
    'RH  ⇔  q(t) = ∫ dμ(u)/((t−u)² + 1/4) for one positive weighted measure μ',
  dyadic:
    'R₂ₐ(w) = Rₐ(w−a)Rₐ(w+a); arbitrary-depth counterpackets block descent to a/2',
  crossScale:
    'exact Qₐ = 𝒜ₐ⁄₂/𝒜ₐ:  det Q₁⁄₂(0, 1/10) = −0.0001676906566…  (certified)',
  crossScaleScope:
    'same test: det 𝒜₁⁄₂ > 6.2560×10⁻⁵ and det 𝒜₁⁄₄ > 1.4539×10⁻⁵',
  landen:
    'tested nome-power / even-index identities translate t and preserve |a|',
  explicitFormula:
    'direct half-Poisson deconvolution = full Guinand–Weil; every nonempty pure prime grouping is indefinite',
  compensatedPrime:
    'all-positive finite-group compact repair needs infinite aggregate charge; no convergent scalar allocation reconstructs Weil',
  tempered:
    'RH ⇔ e^{|u|/2} q̂(u)/(2π) admits a tempered distributional extension',
  weightedPnt:
    'RH ⇔ 2√x − 2 − Σₙ≤ₓ Λ(n)/√n = O((log x)³)',
  oneSidedRung:
    'Eₐ(x) = (xᵃ−1)/a − Σₙ≤ₓΛ(n)nᵃ⁻¹. For 0 < a ≤ 1/2 and 0 ≤ b ≤ a, either Eₐ(x) ≤ Cxᵃ⁻ᵇ(1+log x)ᴺ or Eₐ(x) ≥ −Cxᵃ⁻ᵇ(1+log x)ᴺ already forces the zero strip [b, 1−b]; at a = b = 1/4 it is enough to prove ' +
    '4(x¹ᐟ⁴−1) − Σₙ≤ₓΛ(n)n⁻³ᐟ⁴ ≥ −C(1+log x)ᴺ',
  primeRiesz:
    'T44/T47: at a = 1/4, prime powers cost only a bounded causal correction. At η = 1 and b = 1/8 the exact no-log target is Σp≤x(x−p)log p ≤ (x²−1)/2 + Cx¹⁵ᐟ⁸, equivalent to ℛ1,1/4(x) ≥ −Cx¹ᐟ⁸ and to the strip [1/8, 7/8]',
  scaleAverage:
    'T46/T49: the positive all-integer scale completion converges because ζ cancels the complete zero divisor. Exact Abel deaveraging shows M(x)=O(x⁷ᐟ⁸logᴷx), equivalently Σn≤x μ(n)n⁻³ᐟ⁴=O(x¹ᐟ⁸logᴷx), would recover the staged Riesz rung; neither bound is proved',
  squareScale:
    'T50: square-scale averaging multiplies by ζ(2s), preserves every excluded right-hand pole, and yields an equivalent prime-times-square causal target; functional-equation symmetry supplies the left edge. Its square-Möbius inverse is bounded on two-sided target norms, so absolute averaging does not attenuate the obstruction',
  jacobiHeat:
    'T51/T52: the prime-times-square target is exactly the positive Jacobi heat trace ℋ(u)=Σm,p(log p)e⁻πm²pu; its associated differentiated carrier Jₚ is a positive translate mixture of Ψ. The needed centered bound ℋ(u)≤ζ(2)/(πu)+Cu⁻⁷ᐟ⁸ remains open; its raw positivity, complete monotonicity, and modular splitting do not control the centered remainder',
  jacobiDeconvolution:
    'T53: the causal Jacobi log-kernel has a zero-free symbol, but |ĥ(τ)| ≍ (1+|τ|)¹³ᐟ⁸e⁻π|τ|ᐟ². It preserves every forbidden zeta pole while admitting no finite-measure or tempered inverse. A smooth positive PNT density can satisfy the two-sided averaged bound while its normalized triangular error is unbounded',
  primeRenewal:
    'T54: exact prime-power renewal changes the prime-only causal trace by −ζ(3/2)Q∞ + Γ(3/4)π¹ᐟ⁴t¹ᐟ⁴log(1/t) + O(t¹ᐟ⁴). This bounded lower-order correction cannot create or cancel the missing t⁻¹ᐟ⁸ term',
  thetaFeatures:
    'T56: Kₐ is an exact difference of two Laplace-feature Gram kernels. On every tail and for every finite C, a finite evaluation test satisfies ⟨f,(Kₐ−H)f⟩ > C⟨f,Hf⟩. Even the signed upper relative bound fails; the positive witness does not decide Kₐ ⪰ 0',
  phaseSpace:
    'T57: the homogeneous feature quotient is ξ(2s−1/2−a)/ξ(2s−1/2+a), unimodular on the unitary Mellin line. The Wigner/Weyl relay is the exact shifted completed-ξ modulus difference; endpoint compression is load-bearing',
  finiteHeight:
    'T58: critical-line verification through height H gives |Vθ(x)| ≪ x¹⁵ᐟ⁸ only for x ≤ [H/(log H+2)]⁸. The imported height reaches about 8.25×10⁸⁷, but this is finite-range only',
  finiteHeightSchur:
    'T61: with Y = H−1/2 = 3000175332799.5 and c = π/(2Y), verified zeros through H give |X(w−a)/X(w+a)| < 1 on Re w > 0, |Im w| < Y. The pulled-back sinh-denominator Pick kernel is PSD, but the original linear-denominator kernel is not established: the natural bridge has a negative real 2×2 minor',
  pascalCriterion:
    'T59: RH ⇔ ∏p≤N pᴺ⁻ᵖ ≤ ∏k=0ᴺ C(N,k) for every sufficiently large N. Prime-square bias proves the forward sign; the global radix cancellation remains RH-equivalent and open',
  firstRadix:
    'T62: RH ⇔ Σp≤N[Cₚ(N)−(N−p)]log p ≥ 0 eventually. The omitted higher-radix tail is nonnegative and asymptotic to −ζ(1/2)N³ᐟ²/3; under RH the first layer retains margin 0.1336904124…N³ᐟ². This exact criterion remains RH-equivalent and open',
  fixedMajorant:
    'T60: every fixed strict PNT-admissible majorant of (1−u)₊ adds δx². For an x-dependent family with target-scale uniform prime sampling, preserving the bound requires ∫(Fₓ−w)=O(x⁻¹ᐟ⁸)',
  adaptiveSelberg:
    'T63: every positive x-dependent majorant Fₓ≥g with excess εₓ obeys 𝒮g(x)≤𝒮Fₓ(x)+εₓ. The canonical Selberg family has exact excess π/(2Ω) and sampled excess O(Ω⁻¹), but at Ω ≍ x¹ᐟ⁸ its centered estimate is still T47; its residual Fourier phase survives every constant translation',
  endpointModel:
    'T64: Uₐ*QUₐ−Q = P_{I·conj(J)·K_J}−P_{K_I}. Residual poles have the positive sign, fixed bands have vanishing overlap with poles escaping in height, and half-strip Schur positivity alone does not sign the original linear-denominator endpoint kernel',
  radicalKernel:
    'T65: L_N⁽¹⁾=log(ℜ_N/P_N), with Mellin kernel 𝒦(s)=((s−1)ζ(s)−1)/(s(s+1)). It kills the PNT pole but no zeta zero; ∃Cσ with L_N⁽¹⁾≥−CσN¹⁺σ eventually exactly when Re ρ≤σ, while exact recurrences rule out eventual monotonicity and log-convexity',
  carryRow:
    'T68: with G(n)=∏r≤n rad(r), Cᴿ(N,j)=G(N)/[G(j)G(N−j)] is the squarefree product of least-digit base-p carries, divides C(N,j), and loses only O(√N) logarithmically from higher carries. Its row product is ℜ_N; coordinatewise domination already fails at N=5',
  blockAverage:
    'T69: for W_N=⌊√N/log(2N)⌋, RH ⇔ Σₕ≤W_N L⁽¹⁾_{N+h}≥0 eventually ⇔ ∏ₕ≤W_N ℜ_{N+h}≥∏ₕ≤W_N P_{N+h} eventually. This is a weaker-looking averaged target, but its recovery uses T65 and the sign remains open',
  carryObstruction:
    'T70: critical carry-block columns are not uniformly monotone at all N, complete low-prime residue cycles have negative p-adic balance for m≥2, and the summed worst-case Pascal loss costs coefficient 1·N³ᐟ²—too much even under RH. Eventual column structure remains unexcluded',
  positivePotential:
    'T71: the first-radix kernel has a nonnegative potential 𝔘(x)→γ_E/2 with N³𝔘′₊(N)=L_N⁽¹⁾. Its prime component already decreases at x=3.99, so positivity and convergence of the potential do not sign its sampled right tangents',
  potentialBlock:
    'T72: on each unit cell, G=x³𝔘′₊ is affine with negative drift 𝒞ₙ and a positive radical jump at the next integer. Exact quadrature writes the T69 block as a local potential functional plus (1/2+o(1))N³ᐟ²; eventual potential increase is RH-equivalent, not proved',
  carryThreshold:
    'T73: every positive block exponent lies above p=√N. The top fixed harmonic cell has positive leading mass, every fixed lower cell has negative mass, and a true positive block still fails descending-prefix domination through prefix 17. Growing cells and regrouped transport remain open',
  primeTransport:
    'T74: the complete p≤W_N sector has an explicit negative load between Q₋θ(W_N) and Q₊θ(W_N). These give distinct pointwise necessary and sufficient transport thresholds; the positive N=152 block misses the sufficient Q₊ threshold',
  transportEquivalence:
    'T75: RH ⇔ High(N,W_N)≥Q₊(N,W_N)θ(W_N) eventually. Under RH the N²/log N block margin dominates the O(N²/log²N) transport budget; T74 and T69 give the converse, so this is no asymptotic reduction',
  centeredTransport:
    'T76: D_low=D_cent+C_cov with |C_cov|≤3HΘ₁(H)/16=O(H³), and every reset interval collapses into weighted log rad_{>H}(N+d) terms. This narrows the finite corridor, but RH ⇔ Ξ(N,W_N)≥−E_{W_N} eventually',
  positiveReset:
    'T77: Ξ=B̂+R⁺ with R⁺≥0, but B̂=(H+1)L_N^(1)−H(H+1)(A_N+θ(N))/2 retains the RH-complete defect. At H=W_N, S/(H+1)=L_N^(1)+O(N³ᐟ²/log N), so block smoothing is sub-RH-scale',
  sampledPhase:
    'T78: D_N≤(𝔮+o(1))N and Ξ(N,W_N)/(W_N+1)=L_N^(1)+O(N³ᐟ²/log N). A sampled gap N^δ with deficit N^κ forces Re ρ≤max{1/2,δ,κ−3/2}; at (δ,κ)=(1/2,2), one good checkpoint—and the corresponding local negative-part mean square—per outer √N interval is exactly RH-equivalent',
  squareKernel:
    'T79: D_n/n=𝔮−log(n/rad n)+o(1); sufficiently late positive steps have local √N-window density 7/π², but their positive and negative N³ᐟ² masses cancel and every centered sample remains o(N³ᐟ²)-close to one inherited baseline',
  outerSmoothing:
    'T80: every nonnegative smoothing on a fixed C₀√N outer window satisfies 𝒜_N(ω)=L_N^(1)+o(N³ᐟ²). For the uniform convolution, covariance improves to O(N/log³N), but the Vθ baseline retains coefficient one and each fixed zero-mode multiplier is 1+O_ρ(N⁻¹ᐟ²)',
  sublinearBootstrap:
    'T81: for fixed 0≤δ<1 and κ<5/2, the existence of some C and one Ξ≥−CM^κ in every sufficiently late [N,N+⌊N^δ⌋] is equivalent to Re ρ≤max{1/2,κ−3/2} for every nontrivial zero. Square-kernel feedback removes the one-pass gap loss; at δ=1 this feedback has no contraction',
  squareKernelBallot:
    'T82: H_N=(N−1)J_N−2Σm<N J_m=Σn≤N(2n−N−1)b(n)≥0 and L_N^(1)=ℓ_N−H_N. The local repeated-prime ballot is exactly the known higher-radix correction; the complementary p>√N first-layer channel remains zero-strip complete up to O(N³ᐟ²)',
  signedHaar:
    'T83: adjacent equal-block Haar cancellation has positive tent tails and attenuates each fixed zero mode by Y/N, but the new 1/ρ zero coefficients are not absolutely summable. If the adaptive L^(1) √N-block means eventually obey A_{r+1}−A_r≥−Cn_r^κ for 0≤κ≤3/2, then Re ρ≤max{1/2,κ−1/2}; this is one-way, not an equivalence',
  harmonicCompensation:
    'T84: the high-prime first-radix channel telescopes across harmonic cells. Its N²/8 top-cell subsidy is canceled down to N²K/[2(K+1)²]; PNT control reaches only subpower K, while at K≈√N the centered quadrature lower bound is zero-strip complete and RH-equivalent at N³ᐟ²',
  adaptiveDriftSplit:
    'T85: adaptive drift splits exactly as A_{r+1}−A_r=−Δ_rVθ−Δ_rH+Δ_rΓ. The deterministic term is O(√N log N), the ballot term is O(N⁴ᐟ³(log N)¹ᐟ³), and Δ_rVθ≤CN log²N is itself RH-equivalent. Only a direct N·polylog N cross-channel bound remains a genuinely new sufficient target',
  primePowerRenormalization:
    'T86: with W=Vψ−Vθ and K=H−W, the cross channel is Vθ+H=Vψ+K. Its N·polylog bound is exactly RH conjoined with the separate one-sided K-drift bound. K has only scaled renewal copies ρ/j, while fixed-width repeated-prime tents have variance ≫√H log H; the diagonal adaptive transfer remains open',
  dilationHarmonicLadder:
    'T87: every fixed signed local filter retains a prime-square variance tail, and one exact adaptive ladder is sparse and nonuniform mod 4. A fixed macroscopic dilation 𝔇ₐF=N⁻¹ᐟ²(F(aN)−a³ᐟ²F(N)) instead absorbs the higher-radix channel at O(N): Re ρ≤σ ⇔ 𝔇ₐVθ≤CN^(σ+1/2) eventually. Separately, RH proves G_floor(N^α)^cell>0 for α<1/3, while α=1/8 positivity implies T47',
  positiveAnnularComparator:
    'T88: RH ⇔ 2Σ_{N<p≤2N}(p−N)log p+Σ_{2N<p≤4N}(4N−p)log p≤3N² eventually. Every prime weight is nonnegative and supported in (N,4N]; RH gives the explicit deficit (0.155951…−o(1))N³ᐟ², but the inequality remains unproved',
  dilationHarmonicResponse:
    'T89: for every finite dilation, the 3/2 notch Q(3/2)=0 forces the prime spline to change sign. An exact annular four-scale notch is Ω±(N³ᐟ²) on RH. Polynomial harmonic cross-cell summation likewise restores c_K,N(ρ)=1/[ρ(ρ+1)]+o_ρ(1) for every fixed zero rather than attenuating it',
  annularArithmetic:
    'T90: the positive annular tent has an exact lcm factorization. RH ⇔ L₊Vψ(N)≤log Q₂,N eventually, where Q₂,N is the explicit prime-square layer and every cube-or-higher layer is O(N⁴ᐟ³). This is a pointwise strengthening of T88 whose extra tail is absorbed by its RH margin; the central-binomial route still loses (6log2−3)N²',
  geometricAnnulus:
    'T91: the zero-complete family Qₐ(s)=(aˢ−1)(aˢ−a) retains a positive RH margin for a>1.882453339…. The explicit a=17/9 comparator uses only primes in (81N,289N], has support ratio 289/81<4 and RH margin 48.820170…N³ᐟ², but its eventual sign remains unproved',
  jointAnnulus:
    'T92: two positive rational-mesh tents are jointly zero-complete at support 3.4517217537. T95 closes the signed-curvature gap: the global absolute-amplitude method has sharp support infimum 3.4513363850 for every finite nonnegative piecewise-linear annular kernel, but no eventual sign is proved',
  verifiedZeroAnnulus:
    'T93: peeling 1,000 rigorously isolated critical zeros from the exact Hadamard budget gives one zero-complete a=23/15 tent. RH ⇔ its positive prime inequality on (225N,529N] eventually; support 529/225=2.351111 and the certified RH deficit exceeds 50.625N³ᐟ²',
  factorwiseAnnularBarrier:
    'T94: rowwise factorial and multinomial covers of the rational annular cofactor lose at main order. For a=17/9 the universal factorwise gap is at least 49,173.726993N², so escaping this rowwise cover barrier requires cross-factor carry transport or cancellation',
  allSplineFloor:
    'T95: the same 3.4513363850 support floor holds for every nonzero nonnegative continuous finite piecewise-linear annular kernel under the global coefficientwise amplitude bound. Negative curvature only spends extra amplitude; signed, smooth/infinite-scale, and zero-aware constructions remain outside this classification',
  sharperVerifiedZeroAnnulus:
    'T96: a 256-bit exact-count certificate peels 50,000 zeros at a=32/21. RH ⇔ the positive prime tent on (441N,1024N] is eventually below 2,154,768N²; support 1024/441=2.321995 and the certified RH deficit exceeds 136.1367N³ᐟ²',
  crossFactorCarry:
    'T97: the T93 cofactor is exactly an adjacent multiplicative-block Pascal/carry ballot. Its eventual sign is RH-equivalent, while prime/composite jumps, v₃(S/C)=−4923·3ᴸ+15 on N=3ᴸ, and negative local factors defeat monotonicity, divisibility, pairwise positivity, and independent covers',
  unconditionalAnnularRecurrence:
    'T98: the T93 slack is unconditionally negative for infinitely many integer N, and its full inverse-cubic average is machine-certified below −25,000. If RH is false the slack takes both signs infinitely often; neither subsidiary theorem proves the eventual negative sign required for RH',
  deepAnnularBlocks:
    'T99: the negative prime-square Mellin residue forces liminf D₂₃,₁₅(N)/N³ᐟ²≤−11081.705… and liminf D₃₂,₂₁(N)/N³ᐟ²≤−40805.171… unconditionally. Explicit PNT control expands infinitely many checkpoints into consecutive valid blocks of length ⌊√N·exp(0.8√log N)⌋, but their gaps remain uncontrolled',
  sharperCrossFactorCarry:
    'T100: the sharp T96 cofactor is itself an exact 32/21 adjacent Pascal/carry ballot. Negative 19-adic and 5-adic families, exact negative local factors, and N²-scale factorial-cover gaps remove the same tested local shortcuts and leave aggregate cross-factor transport open',
  proportionalCarryBuffer:
    'T101: Fᵣ,ₛ(k)=Σₕ₌ₖ^⌊rk/s⌋⁻¹qᵣ,ₛ(h) is an exact proportional carry buffer with Fᵣ,ₛ(sN)=log(S_N/C_N). RH is equivalent to eventual positivity on all integers—or on any one fixed residue lane. Each buffer is a nonnegative trapezoidal prime/Pascal kernel whose endpoint dilation exponential polynomial has zeros only on Re z=0,1. T99 transfers to infinitely many long consecutive positive intervals; negative local q-blocks rule out termwise induction, while the RH-complete terminal rank shows that full stop-loss majorization is no shortcut. The gaps remain open',
  beattyCarryTransducer:
    'T102: both sharp ratios satisfy 2r=3s+1, so e(k)=⌊rk/s⌋ has the exact residue-step word (1,2)^m,2 and ΔF=(𝒯−I)q for an expanding block transport 𝒯. Exact rational K-products give F(3)<F(2), F(4)>2F(2), and pair-specific failures of superadditivity. Thus the global all-k forms of ordinary/orbit monotonicity, 𝒯q≥q, subadditivity, and superadditivity fail. Eventual versions and genuinely global arithmetic control remain open',
  localCarryFilter:
    'T103: for any normalized real local filter with uniformly bounded ℓ¹ coefficient norm and width H_k=k^(δ+o(1)), δ<1, RH makes the filtered buffer eventually positive. Conversely, eventual nonnegativity forces Re ρ≤max(1/2,δ). Every such filter through δ=1/2—including rolling averages on the T99/T101 √k·exp(0.8√log k) length—is still RH-equivalent, so bounded-memory smoothing does not close the gaps',
  localFilterConditioning:
    'T104: for a normalized real mass-one additive local filter, if width has exponent δ and coefficient ℓ¹ norm has exponent τ, eventual nonnegativity forces Re ρ≤max(1/2,δ+τ), while RH proves the filtered sign for δ+τ<1. The response bound |M_k(z)−1|≤C_z(H_k/k)‖a_k‖₁ shows that attenuating even one fixed zeta-pole transfer amplitude by a constant factor requires δ+τ≥1. Thus every safely conditioned subcritical filter asymptotically leaves each fixed pole response intact; cross-mode, growing-height, multiplicative-scale, and nonlinear global mechanisms remain unclassified',
  multiplicativePoleNotches:
    'T105: a fixed finite convex multiplicative filter has exponential-polynomial pole response P(z)=Σaνcν^z. If P is zero-free for 3/2<Re z<2, its eventual buffer sign is exactly RH-equivalent. Positive two-scale factors can cancel the continued Mellin poles for any prescribed finite set of verified critical-line modes, and their leading floored responses; the notch multiplier does not amplify another critical-line mode relative to its square response. Their scale span is exp(πΣ1/γ), their term count can reach 2^n, no finite multiplier erases the complete zeta spectrum, and no new eventual arithmetic sign has been proved',
  realPhaseConditioning:
    'T106: for real mass-one additive weights and one fixed nonreal mode z, attenuation below the tangent-line barrier d_z=|Im z|/|z| costs ‖a‖₁≳(k/H)². An exact signed three-node filter attains that pure-mode order. With the T101 floor correction, the necessary exponent is τ≥min(2(1−δ),1), so the total complexity never overlaps the RH-stable δ+τ<1 regime. This is a strong fixed-mode barrier, not a classification of complex, multiplicative, cross-mode, or global filters',
  adaptiveEndpoint:
    'T66: on the common graph domain, a residual-zero-centered profile k_X(x)∝e⁻⁽β⁺ⁱᴸ⁾ˣ1[0,X] suppresses K_I and isolates one residual-pole coordinate. T67 transfers its strict compact-smooth defect to an actual finite exponential matrix witness, but every quantitative parameter remains zero-dependent',
  graphCore:
    'T67: finite tail exponentials graph-approximate every compact continuous input for the compressed theta features and every compact smooth input for the full homogeneous features. No core theorem for the entire maximal domain or uniform degree/conditioning bound follows',
  finiteModes:
    'any nonzero fixed reflected finite raw packet: qF,p(t) = −4(r+1)p/t² + O(t⁻³)',
  gaussian:
    'Gσ=Ψ*φσ: qσ=q+σ² and Wσ=W+σ²δ₀; positivity of its inverse half-Poisson target ⇔ RH',
  finiteOrderSmoothing:
    'an even probability convolution with entire finite-order MGF that preserves the exact zero divisor (with multiplicity) is Gaussian or δ₀; its inverse half-Poisson target remains RH-equivalent',
  cellQuotient:
    'positive Jacobi cells C*c=A with ℱ₂c=q/2>0; e^{|u|}c is exactly the RH-equivalent Weil target',
  gradedBackward:
    'e^{λ|u|}c tempered/PD ⇔ λ/2 ≤ Re ρ ≤ 1−λ/2; any positive rung would prove a uniform zero strip',
  finiteRadialLayers:
    'every fixed finite family of modular/radial shifts with a nonzero fixed PSD coupling in the audited kernel family has a negative 2×2 principal minor sufficiently far in the tail',
  continuumTail:
    'T45/T48/T55–T57/T64/T66–T67: after normalization the exact continuum block converges uniformly in every fixed Cᵐ tail norm to 1/[2 cosh(t−b)]. Every fixed order is eventually positive, but the spectral floor is zero and every finite signed upper H-relative bound fails. Compact-smooth graph approximation yields finite residual-pole witnesses, while zero-uniform control and the global one-sided contraction remain open',
  criticalTail:
    'a nonzero pole share needs an eʰᐟ² non-tempered cross-tail; translation-invariant tempered-lag compensation forces its coefficient a = 0, while an unrestricted Hilbert/GNS factorization exists iff RH',
  levy:
    'certified κ₄ = (log ξ)⁽⁴⁾(1) = −0.00044176332757…; not classically infinitely divisible',
  edge:
    'Jacobi edge redraw:  ℛₐ*ℛₐ = (I + 𝖯ₐ)/2;  𝖯ₐ ⪰ 0 ⇔ ℛₐ*ℛₐ ⪰ I/2',
  douglas:
    'Douglas:  Γ₋ₐ = DₐΓₐ, ‖Dₐ‖ ≤ 1; uniqueness forces Dₐ = TΘₐ*',
  hankel:
    'certified:  Ψ(0)Ψ(1/5) − Ψ(1/10)² < −0.4695376253506527',
  infinitesimal:
    'a ↓ 0:  𝖳₀ ⪰ 0  ⇔  −Im(Ξ′/Ξ) ≥ 0 on C₊  ⇔  RH',
  boundary:
    'off-axis zero dipoles vanish on the real boundary; boundary sign cannot detect them',
  cubic:
    'v = (4,−10,7):  vᵀ𝒜⁽³⁾v < −6.1770462820×10⁻⁵  (certified)',
  structure:
    'After row normalization, the complete correlation kernel is always a ' +
    'positivity-preserving, self-adjoint Markov contraction with spectrum in [−1,1]. ' +
    'The new Wiener–Hopf identity writes the same-sign block as one half of a Toeplitz ' +
    'self-commutator. Cowen rigidity removes every analytic remainder for the completed-ξ ' +
    'symbol, so same-sign positivity alone is already the complete fixed-a obligation. ' +
    'The residual zero divisor reduces the continuous family to infinitely many points of ' +
    'any one sequence tending to zero. At the unconditional half-thickness anchor, the ' +
    'boundary phase gives a scalar positive-Poisson criterion—but that criterion is itself ' +
    'equivalent to RH. Its exact Fourier deconvolution is the Guinand–Weil functional, and ' +
    'even tempered extendibility recovers the full von Koch/RH threshold. Fractional ' +
    'backward weighting now supplies an exact graded target: either one-sided weighted-prime ' +
    'power bound proves the corresponding zero strip, one positive rung proves a uniform ' +
    'zero strip, and the endpoint is RH. T44/T47 make the staged target prime-only, ' +
    'losslessly Riesz-smoothed, and exactly triangular; T45/T48 promote the continuum ' +
    'rescue to every fixed principal order; T46/T49 isolate the signed Mertens bottleneck; ' +
    'T50 preserves the right-hand poles on square scales but gives no absolute attenuation; ' +
    'T51/T52 identify the exact positive Jacobi bridge and why its uncentered sign is insufficient. ' +
    'T53/T54 show that stable Jacobi deconvolution and prime-power renewal cannot supply the centered gain. ' +
    'T55–T57 close fixed-order and absolute-relative continuum promotion while exposing the exact endpoint-compressed feature contraction. ' +
    'T58 gives a finite verified range, T59 an RH-equivalent Pascal comparator, and T60 excludes every fixed strict PNT-admissible majorant. ' +
    'T61 proves a conformally corrected finite-height Schur/Pick window but refutes its natural bridge to the original kernel; ' +
    'T62 reduces the Pascal comparator to its first radix layer, which remains exactly RH-equivalent; ' +
    'T63 proves every tight positive adaptive majorant is still T47; ' +
    'T64 decomposes the endpoint defect into model spaces and rules out fixed-band high-pole detection; ' +
    'T65 exposes the first-radix Mellin kernel and its complete zero obstruction; ' +
    'T66 constructs common-domain quasimodes consistent with the divisor obstruction; ' +
    'T67 transfers their strict compact-smooth defects to finite exponential matrices and proves the corresponding compact graph theorem; ' +
    'T68 factorizes the first-radix quotient into a squarefree least-carry row; ' +
    'T69 gives its critical RH-equivalent consecutive-row average; ' +
    'T70 rules out uniform/all-N column, primewise, and worst-case-loss proofs of that sign; ' +
    'T71 turns the same defect into sampled tangents of a positive convergent potential; ' +
    'T72 derives the exact cell drift and block quadrature; ' +
    'T73 forces positive carry mass above the prime-square threshold and refutes uniform/all-N weak log-majorization; ' +
    'T74 brackets the low-prime load and isolates exact reset transport; ' +
    'T75 proves its eventual critical-window Q₊ condition is RH-equivalent; ' +
    'T76 centers the load to an O(H³) corridor and collapses resets into truncated radicals; ' +
    'T77 absorbs all resets into a positive correction but proves the critical average localizes back to the pointwise defect below the RH scale; ' +
    'T78 sharpens one-sided recovery to D_N≤(𝔮+o(1))N and proves the sampled zero-strip phase law, with one valid centered checkpoint per outer square-root interval still exactly RH-equivalent; ' +
    'T79 classifies the square-kernel increments and proves that their local positive majority cancels at full N³ᐟ² scale; ' +
    'T80 proves every positive outer smoothing retains the same inherited zero wave, despite a one-log covariance gain; ' +
    'T81 feeds the local cancellation back through the provisional zero strip and removes the sampling-gap exponent for every fixed power window N^δ with 0≤δ<1; ' +
    'T82 identifies the natural repeated-prime ballot exactly with the higher-radix correction and isolates a complementary high-prime first-layer channel that retains the full zero-strip obstruction; ' +
    'T83 proves that signed Haar cancellation attenuates fixed modes by half a power, while additive reconstruction restores that loss and turns an O(N) drift bound into a sufficient—but unproved and not known necessary—condition for RH; ' +
    'T84 telescopes the complementary high-prime channel and shows that its top-cell subsidy is canceled into an RH-complete square-root-depth quadrature; ' +
    'T85 separates adaptive drift into prime-error and repeated-prime channels, sharpens the ballot bound to O(N⁴ᐟ³(log N)¹ᐟ³), and isolates the still-open N·polylog N cross-channel correlation; ' +
    'T86 completes θ to ψ and proves that target is RH plus a separate prime-power radix-discrepancy bound, with a rigorous fixed-width variance warning but no diagonal adaptive transfer; ' +
    'T87 extends that warning to every fixed signed filter, proves the adaptive selector is sparse and nonuniform, then removes the extra radix condition with a macroscopic dilation. The resulting prime-only weighted-PNT bound is exactly zero-strip complete, while polynomial harmonic depth supplies an RH-intermediate sign for T47 rather than an unconditional proof. ' +
    'T88 then localizes the full RH criterion to a positive prime tent on the single annulus (N,4N], with an explicit N³ᐟ² margin under RH but no unconditional proof of the sign. ' +
    'T89 proves the complementary structural barrier: every finite 3/2-notch changes sign, an exact annular notch oscillates on RH, and harmonic cross-cell summation restores every fixed first-Riesz zero coefficient. ' +
    'T90 factors the positive annulus exactly into lcm and prime-power layers, producing a square-only strengthening and a Pascal comparator while proving the natural binomial majorant loses at main order. ' +
    'T91 narrows the zero-complete positive support from factor 4 to 289/81. T92 makes two generic tents jointly zero-complete, and T95 extends the sharp 3.451336… global-amplitude floor from concave splines to every finite nonnegative piecewise-linear annular kernel. ' +
    'T93 spends the rigorously isolated first 1,000 zeros individually, shrinking one zero-complete tent to support 529/225=2.351111…. T94 proves every rowwise factorial/multinomial cover still loses at main order. T96 then certifies the first 50,000 zeros and shrinks the support again to 1024/441=2.321995…. T97 identifies the remaining arithmetic target exactly as an adjacent cross-factor carry ballot and rules out its naive monotonicity, divisibility, pairwise, and independent-cover proofs. T98 proves two unconditional subsidiary results for the T93 slack. T99 strengthens recurrence to deep N³ᐟ² checkpoints for both sharp annuli and propagates them into explicit super-√N valid blocks, while T100 derives the exact 32/21 carry ballot and rules out the same local shortcuts at the sharpest support. T101 packages both annuli into an exact all-integer proportional buffer and nonnegative trapezoidal kernel, proves that every fixed residue lane remains RH-complete, and transfers T99 to long consecutive buffer-positive intervals. T102 identifies their shared Beatty word pattern and exactly refutes the global all-k scalar laws. T103 proves every bounded-ℓ¹ local filter through square-root depth remains RH-complete. T104 quantifies the local escape cost; T105 constructs an RH-safe multiplicative escape but proves every finite notch spectrum-incomplete; T106 shows strong real cancellation of one complex local mode has a still higher quadratic conditioning cost. The arithmetic gaps remain uncontrolled, so RH remains open.',
  routeAudit:
    'The complete Jacobi lattice does give positive latent edges, but Gibbs resampling ' +
    'factors only the lazy operator. The direct Douglas factor is uniquely the missing ' +
    'Schur phase, and both tilted Hankel kernels are individually indefinite. At a = 0, ' +
    'off-axis zero dipoles are invisible on the real boundary, so boundary/PDE shortcuts ' +
    'are circular. Exact polynomial and positive-Schwartz counterpackets also show that ' +
    'the dyadic quotient identity has no generic downward sign propagation. The exact ' +
    'theta cross-scale quotient is not a PSD Schur multiplier, while the tested nome-power and ' +
    'even-index identities preserve thickness. Every nonempty pure grouping of inherited prime ' +
    'atoms is indefinite; finite-budget local and exact-reconstruction scalar partitions fail; every nonzero ' +
    'fixed reflected finite raw packet eventually loses phase ' +
    'positivity; and the exact tilted law is not ' +
    'classically infinitely divisible. The cubic ' +
    'coefficient, raw modes, total positivity, gcd blocks, and shellwise SOS routes fail ' +
    'as well. Exact Gaussian smoothing adds only an origin atom, and any even probability ' +
    'smoother with entire finite-order MGF that preserves the exact zero divisor is Gaussian ' +
    'or degenerate. Fixed finite PSD modular/radial shift couplings in the audited kernel ' +
    'family fail in the far tail, while the exact continuum block instead has fixed-order ' +
    'principal positivity uniformly on the whole tail but no order-uniform threshold; ' +
    'far-separated cross minors refute total positivity. Positive all-integer scale completion ' +
    'erases the zero divisor, exact deaveraging requires fixed-power Mertens cancellation, ' +
    'square-scale averaging preserves but does not attenuate the poles, and its exact Jacobi heat trace is positive only before the load-bearing main term is subtracted; its causal smoother has no bounded or tempered inverse, exact prime-power renewal is lower order, fixed-Cᵐ half-sech asymptotics have no all-order spectral gap, every finite signed upper half-sech relative bound fails, every tight positive adaptive majorant remains at the centered T47 scale, the natural sinh-to-linear multiplier for the finite-height Schur window has a negative real 2×2 minor, strip-Schur positivity can still leave the original endpoint kernel indefinite, fixed bands lose high residual poles, and one zero-adaptive common-domain family yields finite exponential witnesses only with zero-dependent support and approximation complexity; the first-radix Mellin kernel retains every zeta-zero pole, its exact sequence has no eventual monotonicity or log-convexity, its squarefree carry-row factors have no coordinatewise sign, and uniform local or primewise block estimates do not repair that sign. ' +
    'The exact repeated-prime ballot is the already-accounted higher-radix correction, while its algebraically disjoint high-prime first-layer complement remains zero-strip complete. Signed mass-zero Haar smoothing loses absolute zero-sum convergence, and reconstructing its additive level restores the attenuated half-power; no converse drift theorem is known. ' +
    'The fixed-filter prime-square variance persists for arbitrary signed weights, but its natural-density limit does not restrict the sparse nonuniform adaptive starts. A fixed multiplicative dilation escapes that local obstruction only by becoming macroscopic; its surviving prime kernel is again an RH-equivalent weighted-PNT remainder. Translation-invariant tempered-lag compensation cannot ' +
    'carry a nonzero pole share, and an unrestricted Hilbert factorization ' +
    'is only an RH-equivalent repackaging. Infinite-order smoothing, infinite non-tempered ' +
    'cancellation inside one block, couplings without positive readout, uniform infinite/continuous ' +
    'fiber mixing, and non-majorant nontranslation-invariant global transforms remain unexcluded. T3 and RH remain open.',
};

const LATEST_TWIN_LADDER_CHECKPOINT = [
  {
    id: 'T47',
    color: '#38bdf8',
    status: 'EXACT CRITERION · BOUND OPEN',
    title: 'The staged strip is one triangular prime inequality',
    formula: 'Σp≤x (x−p)log p ≤ (x²−1)/2 + Cx¹⁵ᐟ⁸',
    detail:
      'This is equivalent to the causal lower bound at x¹ᐟ⁸ and to the closed zero strip [1/8, 7/8]. ' +
      'The first Riesz factor makes the zero sum absolute, so no logarithmic loss is needed. The inequality itself is unproved.',
  },
  {
    id: 'T48',
    color: '#22c55e',
    status: 'PROVED FIXED-ORDER TAIL THEOREM',
    title: 'Continuum principal minors survive clustering and separation',
    formula: '∀n ∃Lₐ,ₙ: [𝒜ₐ(tᵢ,tⱼ)] ≻ 0 for distinct tᵢ ≥ Lₐ,ₙ',
    detail:
      'The normalized block converges in fixed Cᵐ norms to the half-sech kernel. The threshold depends on n, ' +
      'and far-separated ordered cross minors are negative, so this proves neither one global tail PSD statement nor total positivity.',
  },
  {
    id: 'T49',
    color: '#f59e0b',
    status: 'PROVED RELAY · INPUT OPEN',
    title: 'Möbius deaveraging has an exact fixed-power price',
    formula: 'M(x)=O(x⁷ᐟ⁸logᴷx) ⇒ ℛ₁,₁⁄₄(x)=O(x¹ᐟ⁸logᴷx)',
    detail:
      'Abel summation makes the signed bottleneck explicit. This Mertens estimate would prove the staged strip, ' +
      'but it is stronger at boundary multiplicities and is not currently known.',
  },
  {
    id: 'T50',
    color: '#a78bfa',
    status: 'EXACT THETA-ALIGNED ROUTE · BOUND OPEN',
    title: 'Square scales preserve the right-hand zero obstruction',
    formula:
      '16ζ(2)x¹ᐟ⁴/5 − 4ζ(3/2) − Σm²p≤x (log p)(m²p)⁻³ᐟ⁴(1−m²p/x) ≥ −Cx¹ᐟ⁸',
    detail:
      'The multiplier ζ(2s) cannot cancel an excluded right-half zero, and the sparse support is exactly prime-times-square. ' +
      'The transform is boundedly invertible for two-sided target estimates, so any gain must be genuinely one-sided.',
  },
  {
    id: 'T51/T52',
    color: '#f472b6',
    status: 'EXACT JACOBI BRIDGE · CENTERED SIGN OPEN',
    title: 'The sparse target is a positive Twin Ladder heat trace',
    formula: 'ℋ(u)=Σm,p(log p)e⁻πm²pu ≤ ζ(2)/(πu) + Cu⁻⁷ᐟ⁸',
    detail:
      'The displayed bound is equivalent to the staged strip, and its associated differentiated carrier Jₚ is an exact positive translate mixture of Ψ. ' +
      'Its u⁻¹ main term consumes the positivity; complete monotonicity and modular splitting do not control the centered remainder.',
  },
  {
    id: 'T53',
    color: '#fb7185',
    status: 'EXACT SYMBOL · GENERIC CONVERSE REFUTED',
    title: 'Jacobi smoothing is pole-faithful but exponentially unstable',
    formula: '|ĥ(τ)| ≍ (1+|τ|)¹³ᐟ⁸e⁻π|τ|ᐟ²',
    detail:
      'The symbol never vanishes, so no forbidden zeta pole is canceled, but no finite-measure or tempered inverse exists. ' +
      'A smooth positive PNT density satisfies the averaged bound while its pointwise triangular error is unbounded.',
  },
  {
    id: 'T54',
    color: '#fbbf24',
    status: 'EXACT RENEWAL · LOWER ORDER',
    title: 'Prime extraction contributes only a bounded cusp correction',
    formula: 'ℋₚᶜ = ℋΛᶜ − ζ(3/2)Q∞ + Γ(3/4)π¹ᐟ⁴t¹ᐟ⁴log(1/t) + O(t¹ᐟ⁴)',
    detail:
      'The k=2 Möbius/Jacobi term collapses to an explicit positive trace, and every k≥3 term is constant plus O(t¹ᐟ⁴). ' +
      'Renewal cannot touch the open t⁻¹ᐟ⁸ frontier.',
  },
  {
    id: 'T55',
    color: '#2dd4bf',
    status: 'TAIL RIGIDITY · GENERIC PROMOTION REFUTED',
    title: 'Eventual PSD is already the global fixed-thickness condition',
    formula: 'Kₐ|[L,∞) ⪰ 0 for some L  ⇔  𝒜ₐ ⪰ 0 globally',
    detail:
      'The half-sech multiplier has spectral infimum zero, and an analytic counterkernel is indefinite on every tail despite fixed-order positivity. ' +
      'For the exact kernel, real analyticity propagates tail PSD globally; along aₙ→0, infinitely many such claims are RH-equivalent.',
  },
  {
    id: 'T56',
    color: '#ef4444',
    status: 'SIGNED ROUTE COUNTEREXAMPLE · PSD STILL OPEN',
    title: 'Even every finite upper half-sech relative bound fails',
    formula: 'sup ⟨f,(Kₐ−H)f⟩ / ⟨f,Hf⟩ = +∞ on every tail',
    detail:
      'Exact theta features, oscillatory radial tests, and T67 graph approximation preserve a positive finite-evaluation sign. ' +
      'This refutes the signed upper comparison and therefore the absolute one, but the witness points toward Kₐ ⪰ 0 and proves neither PSD nor RH.',
  },
  {
    id: 'T57',
    color: '#c084fc',
    status: 'EXACT PHASE-SPACE RELAY · NOT NARROWER',
    title: 'Center frequency returns to the completed-ξ modulus',
    formula: '∫e²ᵛᵀΣₐ(T,ω)dT = (|X(v+a+iω)|²−|X(v−a+iω)|²)/v',
    detail:
      'The homogeneous feature quotient is the unimodular completed-ξ phase, while the finite endpoint compression is load-bearing. ' +
      'Signed divisor shells and Gaussian smoothing do not supply a smaller positivity theorem.',
  },
  {
    id: 'T58',
    color: '#60a5fa',
    status: 'RIGOROUS FINITE TRANSFER · NO STRIP',
    title: 'Verified zero height reaches a huge finite triangular range',
    formula: 'x ≤ [H/(log H+2)]⁸ ≈ 8.25×10⁸⁷',
    detail:
      'The first-Riesz formula transfers critical-line verification through H to the staged x¹⁵ᐟ⁸ estimate on this bounded range. ' +
      'A fixed height cannot prove the asymptotic inequality or any new zero strip.',
  },
  {
    id: 'T59',
    color: '#f97316',
    status: 'EXACT FINITE CRITERION · RH-EQUIVALENT',
    title: 'One complete Pascal row measures the prime-square bias',
    formula: 'RH ⇔ ∏p≤N pᴺ⁻ᵖ ≤ ∏k=0ᴺ C(N,k) eventually',
    detail:
      'Prime squares dominate the complete critical-zero boundary under RH; Landau positivity gives the converse. ' +
      'The equivalent global radix cancellation remains open and is not a proof of RH.',
  },
  {
    id: 'T60',
    color: '#a3e635',
    status: 'FIXED-MAJORANT ROUTE REFUTED',
    title: 'Fixed majorants lose the triangular scale',
    formula: 'uniform target-scale sampling ⇒ ∫(Fₓ−w)du = O(x⁻¹ᐟ⁸)',
    detail:
      'Every fixed strict PNT-admissible majorant adds δx² by weighted-PNT partial summation, overwhelming x¹⁵ᐟ⁸. ' +
      'For an x-dependent family with target-scale uniform sampling, preserving the bound requires vanishing excess; standard bandlimited extremal families then require growing bandwidth.',
  },
  {
    id: 'T61',
    color: '#06b6d4',
    status: 'FINITE-HEIGHT SCHUR PSD · GLOBAL BRIDGE REFUTED',
    title: 'Verified height yields a conformal Schur window',
    formula:
      'Y=H−1/2, c=π/(2Y): |X(w−a)/X(w+a)|<1 on Re w>0, |Im w|<Y',
    detail:
      'At the imported height, Y=3000175332799.5. The pulled-back Pick kernel with conj(sinh(cw))+sinh(cz) in the denominator is PSD throughout this finite strip. ' +
      'The original linear-denominator kernel is not established: its natural bridge has a negative real 2×2 minor, so this proves neither global kernel PSD nor RH.',
  },
  {
    id: 'T62',
    color: '#e879f9',
    status: 'FIRST RADIX LAYER · RH-EQUIVALENT',
    title: 'The first radix layer already carries the full criterion',
    formula: 'RH ⇔ Σp≤N [Cₚ(N)−(N−p)]log p ≥ 0 eventually',
    detail:
      'The omitted higher-radix tail satisfies H_N≥0 and H_N∼−ζ(1/2)N³ᐟ²/3; under RH the first layer retains normalized margin 0.1336904124…. ' +
      'Conversely its eventual sign implies the T59 Pascal comparison. This exact criterion remains open and is not a proof of RH.',
  },
  {
    id: 'T63',
    color: '#84cc16',
    status: 'ADAPTIVE SELBERG · EXACT NO-GAIN THEOREM',
    title: 'Growing bandwidth reaches—but does not beat—the staged scale',
    formula: '∫(GΩ−g)=π/(2Ω), sample(GΩ−g)=O(Ω⁻¹), Ω ≍ x¹ᐟ⁸',
    detail:
      'Layered Selberg interval majorants give a positive bandlimited cover with target-scale continuous and sampled excess. ' +
      'More generally, any tight positive x-dependent majorant satisfies 𝒮g≤𝒮F+ε, even without translation invariance. The canonical Fourier multiplier also retains a nonlinear residual phase, so the required arithmetic cancellation remains open.',
  },
  {
    id: 'T64',
    color: '#2dd4bf',
    status: 'ENDPOINT MODEL SPACES · FIXED-BAND ROUTE CLOSED',
    title: 'High residual poles escape every fixed detector band',
    formula: 'Uₐ*QUₐ−Q = P_{I·conj(J)·K_J} − P_{K_I}',
    detail:
      'Residual poles are the positive model-space component, but their compression into any fixed band tends to zero as height escapes. ' +
      'An explicit half-strip Schur function also has an indefinite original linear-denominator kernel. T66 analyzes one zero-adaptive common-domain family; global and uniform adaptive inequalities remain open.',
  },
  {
    id: 'T65',
    color: '#f59e0b',
    status: 'RADICAL MELLIN KERNEL · ZERO-COMPLETE',
    title: 'The first-radix shell retains every zeta-zero obstruction',
    formula: '𝒦(s) = ((s−1)ζ(s)−1)/(s(s+1));  𝒦(1)=0, 𝒦(ρ)=−1/[ρ(ρ+1)]',
    detail:
      'The first-radix defect is log(ℜ_N/P_N), including an exact divisor endpoint correction. The existence of a one-sided −CσN¹⁺σ lower bound is equivalent to Re ρ≤σ, ' +
      'while exact radical recurrences prove the sequence is neither eventually monotone, log-convex, nor log-concave.',
  },
  {
    id: 'T66',
    color: '#a78bfa',
    status: 'FINITE RESIDUAL WITNESSES · NO UNIFORM GAIN',
    title: 'A zero-adaptive family geometrically isolates a residual direction',
    formula: 'k_X(x) ∝ e⁻⁽β⁺ⁱᴸ⁾ˣ1[0,X]  ⇒  ‖P_KI A_X‖→0, |⟨A_X,wρ⟩|→|M_S|',
    detail:
      'Exact theta and beta-integral cancellation suppress the base-zero model space and isolate one residual-pole coordinate; a polynomial factor supplies a direction for each strict multiplicity excess. ' +
      'T67 transfers the strict defect to an actual finite exponential matrix. Support, rate, margin, approximation degree, and conditioning remain zero-dependent, so no uniform inequality follows.',
  },
  {
    id: 'T67',
    color: '#14b8a6',
    status: 'PROVED COMPACT GRAPH THEOREM',
    title: 'Tail exponentials capture both theta feature graphs',
    formula: 'g∈C_c^∞  ⇒  eⱼ∈ℰ_L,  ‖T̃ₐE(eⱼ−g)‖₂+‖S̃ₐE(eⱼ−g)‖₂→0',
    detail:
      'Weighted-supremum bounds and Weierstrass approximation give compressed graph convergence for compact continuous inputs. ' +
      'Boundary-jet polynomial approximation plus Mellin Plancherel upgrades compact smooth inputs to full homogeneous graph convergence; this is not a core theorem for the entire maximal domain.',
  },
  {
    id: 'T68',
    color: '#f59e0b',
    status: 'PROVED SQUAREFREE CARRY FACTORIZATION',
    title: 'The radical quotient is one least-digit carry row',
    formula: 'Cᴿ(N,j)=G(N)/[G(j)G(N−j)],  vₚ(Cᴿ(N,j))∈{0,1},  ∏ⱼCᴿ(N,j)=ℜ_N',
    detail:
      'Each entry is squarefree, records the least base-p carry, divides its Pascal-row counterpart, and loses only O(√N) logarithmically from higher carries. ' +
      'The comparator is the primorial staircase ∏j#, but coordinatewise domination fails and ℜ₈/P₈ = 2401/24300 < 1.',
  },
  {
    id: 'T69',
    color: '#84cc16',
    status: 'CRITICAL BLOCK AVERAGE · RH-EQUIVALENT',
    title: 'A √N/log N consecutive-row sign is still zero-complete',
    formula: 'W_N=⌊√N/log(2N)⌋:  RH ⇔ Σ(h=0…W_N) L⁽¹⁾(N+h) ≥ 0 eventually',
    detail:
      'The one-sided recurrence converts block nonnegativity into L_N⁽¹⁾ ≥ −N³ᐟ², while RH gives eventual positivity term by term. ' +
      'This is a weaker-looking averaged arithmetic target, but its reverse direction uses T65 and the averaged sign remains unproved.',
  },
  {
    id: 'T70',
    color: '#fb7185',
    status: 'UNIFORM LOCAL CARRY SHORTCUTS FAIL',
    title: 'All-N and primewise block proofs break',
    formula: 'm≥2: Σ(r=0…p−1) vₚ(ℜ_{mp+r}/P_{mp+r}) = −p(m−1)(p+1)/2',
    detail:
      'Critical block columns can decrease before their midpoint, refuting a uniform/all-N monotonicity shortcut; every completed low-prime residue cycle is strictly negative once m≥2. ' +
      'The summed worst-case Pascal loss also costs coefficient 1·N³ᐟ², too large even under RH. Eventual column structure, T69, and RH remain unrefuted.',
  },
  {
    id: 'T71',
    color: '#38bdf8',
    status: 'POSITIVE POTENTIAL · DERIVATIVE SIGN OPEN',
    title: 'The first-radix defect is a sampled right tangent',
    formula: '𝔘(x) ≥ 0,  𝔘(x)→γ_E/2,  N³𝔘′₊(N)=L_N⁽¹⁾',
    detail:
      'Integrating the sawtooth kernel exposes a nonnegative primitive and an exact convergent arithmetic potential. ' +
      'Its prime component already decreases at x=3.99, so potential positivity controls neither the derivative nor RH.',
  },
  {
    id: 'T72',
    color: '#22d3ee',
    status: 'EXACT BLOCK CALCULUS · SIGN STILL OPEN',
    title: 'The positive potential has affine drift and radical resets',
    formula: 'G(x)=L⁽¹⁾ₙ−𝒞ₙ(x−n);  S(N,H)=∫x³𝔘′(x)dx + ½Σ𝒞ₙ',
    detail:
      'The integer jumps are n·log rad(n+1), and the critical block receives a positive (1/2+o(1))N³ᐟ² sampling correction. ' +
      'PNT control is too coarse at the required local scale; eventual continuum or sampled increase of 𝔘 is itself RH-equivalent.',
  },
  {
    id: 'T73',
    color: '#fbbf24',
    status: 'PRIME-SQUARE TRANSPORT · LOCAL SHORTCUTS FAIL',
    title: 'Positive carry mass lives above √N',
    formula: 'p²≤M ⇒ vₚ(ℜ_M/P_M)≤0;  Δ₁=1/8,  Δₘ<0 for every fixed m≥2',
    detail:
      'Every proof using the prime decomposition must compensate the nonpositive p≤√N sector from above the prime-square threshold. ' +
      'Fixed-cell asymptotics are not uniform in growing m, and the positive N=10,11 block defeats descending-prefix product domination through prefix 17.',
  },
  {
    id: 'T74',
    color: '#c084fc',
    status: 'QUANTIFIED POINTWISE TRANSPORT BRACKET',
    title: 'Low primes impose an exact load on reset intervals',
    formula: '−Q₊θ(H) ≤ Σₚ≤H Eₚlog p ≤ −Q₋θ(H);  High≥Q₊θ(H) ⇒ block≥0',
    detail:
      'One-wrap formulas isolate positive additive reset corrections on short harmonic intervals, while entering primes contribute t(p−t). ' +
      'When Q₋>0, a Q₋ payment is necessary and a Q₊ payment is sufficient. These are distinct pointwise thresholds: the positive N=152, H=2 block still falls below the Q₊ budget.',
  },
  {
    id: 'T75',
    color: '#2dd4bf',
    status: 'CRITICAL TRANSPORT · RH-EQUIVALENT',
    title: 'The sufficient transport endpoint gives no asymptotic shortcut',
    formula: 'RH ⇔ High(N,W_N) ≥ Q₊(N,W_N)θ(W_N) eventually',
    detail:
      'Under RH the critical block is at least cN²/log N, while the Q₊ budget is only O(N²/log²N) and the low sector is nonpositive. ' +
      'Conversely the Q₊ threshold implies T69, hence RH. The exact reset split remains useful, but its full eventual endpoint is not a reduced target.',
  },
  {
    id: 'T76',
    color: '#60a5fa',
    status: 'EXACT CENTERED CORRIDOR · ENDPOINT RH-EQUIVALENT',
    title: 'Residue centering isolates a thin modular covariance',
    formula: 'D_low=D_cent+C_cov,  |C_cov|≤E_H=3HΘ₁(H)/16;  |S−Ξ|≤E_H',
    detail:
      'Cyclic-prefix summation shrinks T74’s pointwise uncertainty from Θ(NH²) to O(H³), or O(N³ᐟ²/log³N) at the critical window. ' +
      'Reset intervals collapse into weighted truncated radicals of N+d with an exact entrant correction. The covariance has both signs, and Ξ≥−E eventually is still RH-equivalent.',
  },
  {
    id: 'T77',
    color: '#f97316',
    status: 'POSITIVE RESET NORMAL FORM · SMOOTHING NO-GAIN',
    title: 'All-prime resets are positive, but the baseline is zero-complete',
    formula: 'Ξ=B̂+R⁺,  R⁺≥0;  S(N,W_N)/(W_N+1)=L_N^(1)+O(N³ᐟ²/log N)',
    detail:
      'Every internal wrap superposes and the centered/entrant terms absorb into R⁺. Yet B̂ contains L_N^(1) exactly. ' +
      'Weighted Mertens cancellation shows the critical block changes that pointwise defect only below the RH scale. ' +
      'Even Ξ≥−CN² eventually for some C>0 remains RH-equivalent. So does, for every η>0, one Ξ≥−M^(2+η) in each sufficiently late mesoscopic interval.',
  },
  {
    id: 'T78',
    color: '#a3e635',
    status: 'SQUARE-ROOT SAMPLING · RH-EQUIVALENT',
    title: 'One good centered checkpoint per outer √N interval is enough',
    formula: 'RH ⇔ max_{N≤M≤N+⌊√N⌋} Ξ(M,W_M) ≥ 0 eventually',
    detail:
      'The sharper increment D_N≤(𝔮+o(1))N yields the phase law Re ρ≤max{1/2,δ,κ−3/2} for a gap N^δ and deficit N^κ. ' +
      'At δ=1/2, one Ξ≥−CM² (or the stronger sign Ξ≥0) in every sufficiently late outer interval is RH-equivalent. ' +
      'The matching every-window negative-part mean-square target is equivalent too. Exact starts 125 and 126 fail, so “eventually” is essential; the inner ladder still has width W_M≈√M/log M.',
  },
  {
    id: 'T79',
    color: '#22d3ee',
    status: 'SQUARE-KERNEL MAJORITY · EXACT CANCELLATION',
    title: 'Most radical steps are positive, but square-kernel spikes cancel them',
    formula: 'H=⌊√N⌋: #{N<n≤N+H:D_n>0}=7H/π²+O(N¹ᐟ³)',
    detail:
      'Since D_n/n=𝔮−log(n/rad n)+o(1) and log 2<𝔮<log 3, sufficiently late positive steps are exactly the squarefree class and n=4m with m odd and squarefree. ' +
      'Their positive N³ᐟ² mass is canceled by the rarer negative square-kernel spikes, and the whole outer window remains o(N³ᐟ²)-close to one inherited baseline. ' +
      'The exact all-negative Ξ window [126,137] still contains three primes and a squarefree majority.',
  },
  {
    id: 'T80',
    color: '#a78bfa',
    status: 'POSITIVE OUTER SMOOTHING · ZERO WAVE RETAINED',
    title: 'A second averaging layer changes covariance, not the RH baseline',
    formula: '𝒜_N(ω)=L_N^(1)+o(N³ᐟ²);  zero multiplier=1+O_ρ(N⁻¹ᐟ²)',
    detail:
      'Every nonnegative weighting on a fixed C₀√N outer window retains the pointwise first-radix baseline with coefficient one. ' +
      'For the uniform double convolution, periodicity improves only the normalized covariance to O(N/log³N); it does not attenuate any fixed zero mode, so eventual positivity remains RH-equivalent.',
  },
  {
    id: 'T81',
    color: '#f472b6',
    status: 'SUBLINEAR BOOTSTRAP · GAP LOSS REMOVED',
    title: 'Every fixed N^δ checkpoint window below linear scale is sharp',
    formula: '0≤δ<1, κ<5/2: (∃C, one Ξ≥−CM^κ per late N^δ window) ⇔ Re ρ≤max{1/2,κ−3/2}',
    detail:
      'The generalized square-kernel discrepancy has exponent e(δ)=1/3 up to δ=2/3 and e(δ)=δ/2 thereafter, always below 1/2. ' +
      'Feeding a provisional rightmost-zero exponent B through the local transport gives B≤max{1/2,κ−3/2,B+δ−1}, so every fixed power gap N^δ with δ<1 contracts away. ' +
      'A nonnegative checkpoint—or, for some C, even Ξ≥−CM²—in every sufficiently late such interval is RH-equivalent. This does not prove the checkpoints exist; at δ=1 this feedback has no contraction.',
  },
  {
    id: 'T82',
    color: '#f59e0b',
    status: 'EXACT SQUARE-KERNEL BALLOT · WRONG-SIGN DEBT',
    title: 'The natural radical ballot sum is already the higher-radix correction',
    formula: 'H_N=(N−1)J_N−2Σm<N J_m=Σn≤N(2n−N−1)b(n)≥0;  L_N^(1)=ℓ_N−H_N',
    detail:
      'The sign is prime-powerwise, not a generic consequence of the signed ballot weights. H_N helps the full Pascal quantity ℓ_N, but is subtractive relative to the stronger first-radix target L_N^(1), and it changes by only o(N³ᐟ²) across every fixed sublinear power window. ' +
      'The local b-word sees only primes p≤√(N+N^δ). Its complementary high-prime first-layer sum differs from L_N^(1) by O(N³ᐟ²), so the corresponding lower bound remains zero-strip complete—and RH-equivalent at the endpoint. This is method-specific algebraic blindness, not an independence claim.',
  },
  {
    id: 'T83',
    color: '#34d399',
    status: 'SIGNED HAAR ATTENUATION · SUFFICIENT DRIFT OPEN',
    title: 'Mass-zero cancellation loses half a power; rebuilding the level gives it back',
    formula: 'A_r=adaptive L^(1) √N-block mean;  0≤κ≤3/2: eventually A_{r+1}−A_r≥−Cn_r^κ ⇒ Re ρ≤max{1/2,κ−1/2}',
    detail:
      'Adjacent equal-block Haar weights have an exact positive-tent increment form. For fixed ρ and Y+H=o(N), each zero mode is multiplied by (ρ+1)Y/N+O_ρ(Y(Y+H)/N²), but the resulting 1/ρ coefficients are not absolutely summable. ' +
      'Telescoping adaptive L^(1) √N-block means restores the lost half-power: an eventual O(N) lower drift bound, a fixed polylogarithmic relaxation of it, or nonnegative drift would be sufficient for RH. No converse is proved—RH is not known to imply these drift conditions, and the two checked finite Haar signs do not decide an eventual sign.',
  },
  {
    id: 'T84',
    color: '#fb923c',
    status: 'HARMONIC COMPENSATION · RH-COMPLETE AT √N DEPTH',
    title: 'The positive top cell is discharged by the lower harmonic cells',
    formula: 'G_K^cell=M_K+Q_K;  M_K=N²K/[2(K+1)²]−N(ℋ_{K+1}−1);  K≈√N: Q_K≥−CN¹⁺σ ⇔ Re ρ≤σ',
    detail:
      'The first-radix coefficient is affine on each prime cell (N/(m+1),N/m], with positivity confined to a short terminal sliver. Exact telescoping cancels the N²/8 top-cell subsidy down to N²K/[2(K+1)²]. ' +
      'Quantitative PNT control proves positivity only for subpower harmonic depth. At K≈√N, the centered quadrature differs from the complementary high-prime channel below the critical scale and its N¹⁺σ lower bound is exactly the zero-strip criterion—RH-equivalent at σ=1/2. This is a no-gain classification, not the missing bound.',
  },
  {
    id: 'T85',
    color: '#c084fc',
    status: 'ADAPTIVE CHANNEL SPLIT · CROSS-CORRELATION OPEN',
    title: 'The signed drift is prime error minus the repeated-prime ballot debt',
    formula: 'A_{r+1}−A_r=−Δ_rVθ−Δ_rH+Δ_rΓ;  |Δ_rH|≪N⁴ᐟ³(log N)¹ᐟ³;  RH ⇔ Δ_rVθ≤CN log²N eventually',
    detail:
      'The exact unequal-width tent separates the adaptive L^(1) block drift into a prime-error channel, the higher-radix ballot channel, and a deterministic O(√N log N) Pascal term. A refined divisor switch improves the ballot estimate to O(N⁴ᐟ³(log N)¹ᐟ³), but its N¹ᐟ³ reset-count loss remains a method barrier. ' +
      'Controlling the prime-error drift separately at N log²N is already RH-equivalent. The genuinely new sufficient target is a direct upper bound Δ_rH+Δ_rVθ≤CN(log N)^A; it is unproved, and T86 below identifies its exact extra condition.',
  },
  {
    id: 'T86',
    color: '#38bdf8',
    status: 'PRIME-POWER RENORMALIZATION · SECOND CONDITION EXPOSED',
    title: 'Completing θ to ψ preserves the zero wave and isolates the radix noise',
    formula: 'Vθ+H=Vψ+K;  B_W ⇔ RH ∧ B_K;  Var_nat(R_H)≫√H log H (fixed H first)',
    detail:
      'The exact defect K=H−(Vψ−Vθ) is a first-radix sum over higher prime powers. Its renewal summands place copied singularities at scaled locations 1/j and ρ/j, so it has no copy of the original right-half zero pole at ρ and cannot provide mode-by-mode cancellation of Vψ. ' +
      'The proposed cross-channel N·polylog bound is therefore exactly RH conjoined with a separate one-sided N·polylog bound for ΔK. A natural-density calculation proves fixed equal-width tent variance ≫√H log H, but the limit takes the averaging range to infinity before H grows; it neither reaches H≈√N on the adaptive starts nor refutes the one-sided target. RH remains open.',
  },
  {
    id: 'T87',
    color: '#22c55e',
    status: 'MACRO DILATION ESCAPE · HARMONIC SIGN LADDER',
    title: 'A nonlocal secant removes the extra radix condition but remains zero-complete',
    formula: '𝔇₄F=N⁻¹ᐟ²(F(4N)−8F(N));  Re ρ≤σ ⇔ 𝔇₄Vθ≤CN^(σ+1/2)',
    detail:
      'Every finite signed local filter retains an exact large-prime-square variance tail, while the adaptive starts form a zero-density quadratic set that is already nonuniform modulo 4. Those facts block a naive density transfer but do not prove a one-sided failure. ' +
      'At macroscopic width, the entire higher-radix secant is O(N), every off-critical zero mode survives, and the remaining prime-only weighted-PNT estimate is exactly the zero-strip criterion; at σ=1/2 it is RH-equivalent and unproved. In a separate intermediate theorem, RH implies G_floor(N^α)^cell>0 for α<1/3, and the α=1/8 sign implies T47. RH remains open.',
  },
  {
    id: 'T88',
    color: '#a3e635',
    status: 'POSITIVE ANNULAR COMPARATOR · STRICT REDUCTION',
    title: 'RH is equivalent to one nonnegative prime tent on (N, 4N]',
    formula: 'RH ⇔ 2Σ_{N<p≤2N}(p−N)log p + Σ_{2N<p≤4N}(4N−p)log p ≤ 3N² eventually',
    detail:
      'The dilation L₊F=F(4N)−3F(2N)+2F(N) cancels every prime p≤N and leaves only nonnegative triangular weights in one fixed annulus. ' +
      'On RH, the retained prime-square bias dominates the complete critical-zero wave and gives L₊Vθ≤−(0.155951…−o(1))N³ᐟ². Conversely, the eventual non-strict inequality recovers a one-sided Vψ=O(N³ᐟ²) bound and hence RH. This is the base positive-annular reduction that T91 narrows; its inequality remains open.',
  },
  {
    id: 'T89',
    color: '#e879f9',
    status: 'DILATION SIGN BARRIER · HARMONIC ZERO RESTORATION',
    title: 'Removing the square bias necessarily restores a signed zero wave',
    formula: 'Q(3/2)=0 ⇒ ∫w(u)u⁻¹ᐟ²du=0 ⇒ w changes sign;  c_K,N(ρ)=1/[ρ(ρ+1)]+o_ρ(1)',
    detail:
      'Every nontrivial finite dilation that notches the N³ᐟ² prime-square mode has a sign-changing prime spline. The exact annular filter F(64N)−13F(16N)+44F(4N)−32F(N) preserves every off-critical zero and is Ω±(N³ᐟ²) on RH, so it cannot support an eventual-sign shortcut. ' +
      'The polynomial-depth harmonic quadrature behaves the same way spectrally: cross-cell summation cancels the artificial K-loss but restores each fixed zero’s first-Riesz coefficient. At α=1/8, failure of T47 forces unbounded normalized negative excursions. RH remains open.',
  },
  {
    id: 'T90',
    color: '#fbbf24',
    status: 'ANNULAR LCM FACTORIZATION · SQUARE-ONLY STRENGTHENING',
    title: 'The positive tent splits exactly into prime-power layers',
    formula: 'RH ⇔ L₊Vψ(N)≤log Q₂,N eventually;  A_N=∏ₐQₐ,N=∏_{m=N}^{2N−1} lcm(1…2m)lcm(1…2m+1)/lcm(1…m)²',
    detail:
      'The full Λ-weighted annulus is one integer lcm quotient, and its square layer is an explicit product over √N<p<2√N. Cubes and higher contribute only O(N⁴ᐟ³), so the T88 RH margin proves the square-only ψ-completed inequality; conversely, subtracting every higher layer recovers the T88 prime sign. ' +
      'Only the square factor cancels, leaving the cube-and-higher tail as a pointwise strengthening rather than an easier theorem. The annular Pascal-row comparison is RH-equivalent, while the canonical central-binomial divisibility majorant costs 6log2·N² instead of the allowed 3N². RH remains open.',
  },
  {
    id: 'T91',
    color: '#2dd4bf',
    status: 'NARROWER POSITIVE ANNULUS · STRICT SUPPORT REFINEMENT',
    title: 'A zero-complete rational tent shrinks the support below factor four',
    formula: 'RH ⇔ 17Σ_{81N<p≤153N}(p−81N)log p + 9Σ_{153N<p≤289N}(289N−p)log p ≤ 127296N² eventually',
    detail:
      'For the geometric family Qₐ(s)=(aˢ−1)(aˢ−a), every multiplier zero lies on Re s=0 or 1, while the prime kernel stays nonnegative. The certified RH margin turns positive at a=1.882453339…, so rational supports can approach the ratio 3.543630574… from above. ' +
      'The low-complexity choice a=17/9 has support ratio 289/81=3.567901… and RH deficit (48.820170…−o(1))N³ᐟ². Generic positive tents need not be zero-complete, and this narrower eventual inequality is still unproved. RH remains open.',
  },
  {
    id: 'T92',
    color: '#818cf8',
    status: 'JOINT ZERO-COMPLETENESS · SHARP METHOD FLOOR',
    title: 'Two positive tents remove each other’s blind multiplier zeros',
    formula: 'c=124/123; m=61,62; support c¹⁵³=3.4517217537; T92 concave-floor b*=3.4513363850',
    detail:
      'The two rational-mesh multiplier polynomials have exact common gcd (z−1)(z−c), certified by a degree-two gcd modulo 1,000,003. Their RH margins are separately positive, so the conjunction of their eventual prime signs is RH-equivalent even though a generic single positive tent may hide an off-critical mode. ' +
      'A Green-measure decomposition shows that the certified amplitude ratio of every concave positive piecewise-linear annular kernel is a denominator-weighted average of single-tent ratios. Thus no number of scales reaches support b≤3.4513363850 under the global absolute-amplitude certificate, while three consecutive filters approach that floor from above. T95 extends the same floor to all finite nonnegative piecewise-linear kernels. Neither theorem proves an eventual sign.',
  },
  {
    id: 'T93',
    color: '#4ade80',
    status: 'VERIFIED-ZERO ANNULUS · STRICT SUPPORT REDUCTION',
    title: 'The first 1,000 zeros cut the positive support to 529/225',
    formula: 'RH ⇔ 23Σ₂₂₅N<p≤₃₄₅N(p−225N)log p + 15Σ₃₄₅N<p≤₅₂₉N(529N−p)log p ≤ 419520N² eventually',
    detail:
      'A 256-bit FLINT/Arb certificate isolates the first 1,000 nontrivial zeros, independently counts exactly 1,000 zeros through the midpoint after γ₁₀₀₀, and spends those conjugate-pair amplitudes exactly. Under RH, every remaining zero is covered by the residual completed-zeta budget. ' +
      'For a=23/15 the rigorous margin is δ=0.00104911306566…>0.001, giving an integer-scaled RH deficit above 50.625N³ᐟ² and support ratio 529/225=2.351111…. The converse is the same zero-complete dilation argument. The displayed eventual inequality remains unproved, so RH remains open.',
  },
  {
    id: 'T94',
    color: '#fb7185',
    status: 'FACTORIAL-COVER BARRIER · CROSS-FACTOR ROUTE OPEN',
    title: 'Rowwise binomial and multinomial covers overpay before the RH scale',
    formula: 'factorwise cost ≥2log2·127296N²; allowance=127296N²; unavoidable gap=49173.726993…N²',
    detail:
      'The rational annular cofactor factors exactly into paired primorial quotients. Each 17/9 quotient fits inside a true binomial coefficient, but uniform Stirling summation costs 187030.814660…N², already 59734.814660…N² too much. ' +
      'More generally, packing denominator parts proves a 2log2 lower cost per unit primorial-index gap for every factorwise multinomial cover. Prime squares and higher powers are lower order and cannot repay the N² loss. Any cofactor-factorial proof of T93 must exploit cancellation or carry transport across factors, not independent row covers.',
  },
  {
    id: 'T95',
    color: '#c084fc',
    status: 'ALL-SPLINE METHOD FLOOR · GLOBAL-AMPLITUDE CLASSIFICATION',
    title: 'Nonconcavity cannot beat the global absolute-amplitude floor',
    formula: 'finite w≥0, PL on [1,B] ⇒ Qw(3/2)/‖Qw‖₁,₃ᐟ₂ ≤ max₁<u<B (L_B(u)−u³ᐟ²)/(L_B(u)+u³ᐟ²)',
    detail:
      'Writing μ=−w″ as signed curvature separates the positive-curvature gain from the negative-curvature amplitude cost. The exact endpoint moments show that negative curvature can only lower the certified response ratio; equality returns to the concave tent sector. ' +
      'Therefore b*=3.451336384960… is the sharp floor for every nonzero nonnegative continuous finite piecewise-linear annular kernel under the global coefficientwise zero budget. Signed kernels, smooth or infinite-scale families, and zero-aware budgets are deliberately outside this theorem.',
  },
  {
    id: 'T96',
    color: '#34d399',
    status: '50,000-ZERO ANNULUS · STRICT SUPPORT REDUCTION',
    title: 'A certified a=32/21 tent cuts support to 1024/441',
    formula: 'RH ⇔ 32Σ₄₄₁N<p≤₆₇₂N(p−441N)log p + 21Σ₆₇₂N<p≤₁₀₂₄N(1024N−p)log p ≤ 2154768N² eventually',
    detail:
      'A 256-bit FLINT/Arb run isolates the first 50,000 consecutive nontrivial zeros, independently proves the multiplicity-counted Turing total at height 40,433.958…, and leaves a nonnegative residual Hadamard budget. ' +
      'At a=32/21 it certifies δ=0.000705772803290…>7/10000. The support ratio is 1024/441=2.32199546485…, and the integer-scaled conditional deficit exceeds 136.1367N³ᐟ². The converse remains zero-complete; the eventual inequality itself is unproved.',
  },
  {
    id: 'T97',
    color: '#f59e0b',
    status: 'EXACT CROSS-FACTOR BALLOT · TESTED LOCAL SHORTCUTS FAIL',
    title: 'The annular cofactor is an adjacent Pascal/carry mean comparison',
    formula: 'log(S_N/C_N)=2760N(mean₃₄₅N≤u<₅₂₉N log K_u − mean₂₂₅N≤u<₃₄₅N log K_u)',
    detail:
      'The T93 prime product C_N and Pascal-row ratio S_N satisfy RH ⇔ C_N≤S_N eventually. Their quotient telescopes exactly into adjacent products of K_u=(u+1)^u/(u!·rad(u!)). ' +
      'K_u rises at composites and falls at primes; v₃(S_{3ᴸ}/C_{3ᴸ})=−4923·3ᴸ+15, so the direct C_N | S_N route fails on an infinite subsequence. Exact negative pair and block fixtures also defeat universal pairwise and per-block positivity. The open route is genuinely cross-factor cancellation, not independent row covering.',
  },
  {
    id: 'T98',
    color: '#38bdf8',
    status: 'UNCONDITIONAL RECURRENCE · CERTIFIED GLOBAL AVERAGE',
    title: 'The T93 slack is negative infinitely often—but not yet eventually',
    formula: 'D(N)<0 for infinitely many integer N;  ∫₁∞D(x)x⁻³dx < −25000',
    detail:
      'A Mellin/Landau argument proves eventual nonnegativity would force RH; the certified RH margin then contradicts it. Hence D(N)<0 infinitely often unconditionally, and if RH is false both strict signs occur infinitely often. ' +
      'A separate 256-bit prime-log interval certificate proves the absolutely convergent whole-range inverse-cubic average is below −25,000. This average has no tail or integer-sign implication. The precise missing PNT scale is also exposed: current unconditional errors remain far above the required N³ᐟ² bias. RH remains open.',
  },
  {
    id: 'T99',
    color: '#22d3ee',
    status: 'UNCONDITIONAL DEEP RECURRENCE · EXPLICIT LONG BLOCKS',
    title: 'The prime-square pole forces super-√N runs of valid scales',
    formula: 'liminf D₂₃,₁₅(N)/N³ᐟ²≤−11081.705…;  liminf D₃₂,₂₁(N)/N³ᐟ²≤−40805.171…',
    detail:
      'The negative real residue at the prime-square pole s=3/2 and Landau positivity force N³ᐟ²-scale negative checkpoints for both certified annuli, with no RH assumption and no appeal to their conditional margins. ' +
      'The explicit Fiori–Kadiri–Swidinsky PNT error then keeps each sufficiently late checkpoint negative across ⌊√N·exp(0.8√log N)⌋ consecutive scales. These starts can remain arbitrarily sparse, so long valid runs do not supply the eventual sign required for RH.',
  },
  {
    id: 'T100',
    color: '#fbbf24',
    status: 'SHARPEST EXACT CARRY BALLOT · AGGREGATE ROUTE OPEN',
    title: 'The 32/21 annulus inherits the full cross-factor bottleneck',
    formula: 'log(S*_N/C*_N)=7392N(mean₆₇₂N≤u<₁₀₂₄N log K_u − mean₄₄₁N≤u<₆₇₂N log K_u)',
    detail:
      'The T96 prime cofactor C*_N and Pascal ratio S*_N satisfy RH ⇔ C*_N≤S*_N eventually and telescope exactly into adjacent 32/21 blocks of K_u=(u+1)^u/(u!·rad(u!)). ' +
      'The identities v₁₉(S*_{19ᴸ}/C*_{19ᴸ})=−174·19ᴸ−15 and v₅(S*_{5ᴸ}/C*_{5ᴸ})=−28082·5ᴸ+29, together with exact negative pair and block factors, defeat direct divisibility and universal pair/per-block positivity. Independent factorial covers still overpay by at least 832,374.7279…N². The aggregate eventual sign remains RH-equivalent and unproved; RH remains open.',
  },
  {
    id: 'T101',
    color: '#2dd4bf',
    status: 'ALL-INTEGER RH CRITERION · LONG BLOCKS PROVED · EVENTUAL SIGN OPEN',
    title: 'Proportional carry buffering exposes the exact aggregate frontier',
    formula: 'Fᵣ,ₛ(k)=Σₕ₌ₖ^⌊rk/s⌋⁻¹qᵣ,ₛ(h);  RH ⇔ Fᵣ,ₛ(sN+d)>0 eventually for each fixed d',
    detail:
      'At aligned k=sN the buffer is exactly log(S_N/C_N); for every k≥2 it is also a nonnegative trapezoidal prime/Pascal kernel whose endpoint dilation exponential polynomial has zeros only on Re z=0 and Re z=1. ' +
      'T99 now gives Fᵣ,ₛ(k)>0 on infinitely many consecutive intervals of length s√N·exp(0.8√log N)+O(1). Their gaps remain uncontrolled, and even one fixed residue lane is already RH-equivalent. Exact negative q-blocks defeat termwise induction, while full stop-loss majorization contains the same RH-complete terminal sum. No eventual sign is proved; RH remains open.',
  },
  {
    id: 'T102',
    color: '#fb7185',
    status: 'EXACT BEATTY TRANSPORT · GLOBAL ALL-k SCALAR LAWS FAIL',
    title: 'The shared floor-word pattern transports block mass—not sign',
    formula: '2r=3s+1;  ΔF=(𝒯−I)q;  e(k+1)−e(k)=(1,2)^m,2',
    detail:
      'Both 23/15 and 32/21 use the same rational Beatty word. The exact operator 𝒯 expands q-blocks and telescopes complete cycles, but every residue transition compares mixed-sign lower and upper pieces. ' +
      'Exact rational K-products prove F(3)<F(2) for both ratios, F(4)>2F(2) for both, and pair-specific failures of superadditivity. This defeats the global all-k forms of ordinary/orbit monotonicity, 𝒯q≥q, subadditivity, and superadditivity. Eventual versions, nonlinear transport, and genuinely global induction remain unexcluded. The aggregate gap remains open.',
  },
  {
    id: 'T103',
    color: '#a78bfa',
    status: 'ZERO-STRIP THEOREM · SQUARE-ROOT LOCAL FILTERS RH-COMPLETE',
    title: 'Bounded-ℓ¹ local smoothing cannot bridge the proved blocks',
    formula: '𝒜(k)=Σⱼaₖ,ⱼF(k+j)≥0 eventually  ⇒  Re ρ≤max(1/2,δ)',
    detail:
      'For real weights with Σa=1, uniformly bounded Σ|a|, and H_k=k^(δ+o(1)), RH makes 𝒜(k)>0 for every δ<1. The converse forces the displayed zero strip. ' +
      'Hence every such signed or positive filter through δ=1/2 is exactly RH-equivalent, including rolling averages over √k·exp(0.8√log k), the T99/T101 block length. Growing coefficient ℓ¹ norms, wider fixed-power windows, and nonlinear global transforms are not classified as equivalences. RH remains open.',
  },
  {
    id: 'T104',
    color: '#f59e0b',
    status: 'FIXED-MODE CONDITIONING BOUND · CRITICAL COMPLEXITY REQUIRED',
    title: 'Attenuating one pole already leaves the safe local regime',
    formula: '|Mₖ(z)−1|≤C_z(Hₖ/k)‖aₖ‖₁;  |Mₖ(z)|≤η<1 ⇒ ‖aₖ‖₁≳k/Hₖ',
    detail:
      'For a normalized real mass-one additive local filter, let width be k^(δ+o(1)) and coefficient ℓ¹ norm be k^(τ+o(1)). RH preserves the filtered positive margin when δ+τ<1; an eventual nonnegative sign forces Re ρ≤max(1/2,δ+τ), so δ+τ≤1/2 is still RH-equivalent. ' +
      'More sharply, fixed-factor attenuation of even one fixed zeta-pole transfer amplitude along an unbounded sequence requires δ+τ≥1. The exact floored T101 multiplier has the same conditioning scale. Equality is only necessary, not sufficient, and the theorem does not rule out cross-mode cancellation, growing-height modes, multiplicative windows, or nonlinear global transforms. RH remains open.',
  },
  {
    id: 'T105',
    color: '#38bdf8',
    status: 'FINITE MULTIPLICATIVE NOTCHES · RH-SAFE BUT SPECTRUM-INCOMPLETE',
    title: 'Known pole modes can be removed without losing the equivalence',
    formula: 'P(z)=Σaνcνᶻ;  pℓ(z)=(Rℓ+qℓᶻ)/(Rℓ+1),  qℓ=e^(π/γℓ)',
    detail:
      'For fixed nonnegative mass-one dilation weights, a zero-free multiplier on 3/2<Re z<2 gives an exact RH-equivalent eventual buffer sign. Each positive two-scale factor exactly cancels one prescribed conjugate pair in the continued Mellin transform and cancels its leading floored power response; for verified critical-line modes its zeros stay on Re z=3/2 and |P(3/2+it)|/P(3/2)≤1. ' +
      'The construction costs multiplicative span exp(πΣ1/γℓ) and up to 2^n scales. A finite exponential polynomial has only O(T) zeros, so it cannot erase the T log T distinct zeta spectrum. Counting does not exclude cancellation of a finite or sparse off-line set; ruling that out requires a zero-free multiplier or a family with zero-free common set. The optimized arithmetic sign remains open, and RH is not proved.',
  },
  {
    id: 'T106',
    color: '#fb7185',
    status: 'REAL PHASE-CANCELLATION BARRIER · QUADRATIC CONDITIONING',
    title: 'A real local filter needs second-order leverage to cancel one pole',
    formula: '|M(z)|≤η<|Im z|/|z|  ⇒  ‖a‖₁≳(k/H)²',
    detail:
      'For one fixed nonreal mode and real mass-one additive weights, the first-order response lies on the affine line 1+zℝ, a positive distance from zero. Stronger attenuation therefore costs quadratic conditioning, and an exact signed three-node pure-mode nuller attains that order. ' +
      'For the floored T101 response the necessary exponent is τ≥min(2(1−δ),1); hence δ+τ never enters the RH-stable subcritical regime. The bound applies only below the tangent-line threshold and is necessary—not a sign proof. Complex weights, cross-mode cancellation, multiplicative windows, and global transforms remain outside it. RH remains open.',
  },
];

const DYSON_LANE_RESIDUALS = [
  {
    id: 'R1',
    tag: 'sg1c-r1-excursion-cap',
    color: '#f97316',
    badge: 'DYNAMICAL REACHABILITY',
    title: 'R1: Excursion-cap dynamical reachability',
    status: 'OPEN',
    body: [
      'The static obstruction is settled: Theorem R1-T2 shows the uniform-lattice tie value ' +
      'Theta_K = K/(K+1) rises to 1 as K grows, so no static Theta comparison can cap Theta_exc < 1. ' +
      'Theorem R1-T3 gives the exact asymmetric seizing-margin 1/(b(b+1)(b+2)) -> 0, ' +
      'and empirical basin closure (R1-T4) shows worst dynamical excursion ~0 over the 34-run config set.',
      'The open residual is DYNAMICAL REACHABILITY: does the attractive Calogero-Moser flow ' +
      'started from genuine real-zero-like data ever drive the minimal-gap locus onto a long ' +
      'near-uniform lattice — the sole route by which Theta_exc could drop below 1? ' +
      'The dressed static excursion ceiling is ' + EXCURSION_CAP + ' (empirical, config set) ' +
      'with dynamical excursion evidence 0.51. Neither number is inside the ' +
      'stated Theorem-A trap Theta <= ' + THEOREM_A_CAP + ' on its face; any ' +
      'basin implication needs a separately proved map between the quantities. ' +
      'But this is an empirical bound on a finite config set, not a global proof that ' +
      'arbitrary real-zero configurations avoid the near-uniform-lattice locus.',
    ],
    links: [
      { to: '/theta-static-obstruction', label: 'R1-T2/T3 Static Obstruction' },
      { to: '/theta-basin-closure', label: 'R1-T4 Basin Closure' },
      { to: '/spectral-attack', label: 'Spectral Attack (c_glob context)' },
    ],
  },
  {
    id: 'R2',
    tag: 'sg1c-r2-isolation-persistence',
    color: '#a78bfa',
    badge: 'OBSERVED RANGE · NO LOWER BOUND',
    title: 'R2: sampled asymmetric isolation onsets (' +
      C_OBSERVED_MIN.toFixed(7) + ', ' + C_ASYM.toFixed(7) + ')',
    status: 'OPEN',
    body: [
      'The global asymmetric multi-body isolation constant c_glob is defined as the infimum of ' +
      'all worsening-onset values rho(c) over all asymmetric multi-body environments. ' +
      'Every numerically located onset is only an UPPER BOUND on c_glob; no rigorous lower bound ' +
      'below the basin constant 0.72 has been proven.',
      'Observed values include ' + C_OBSERVED_MIN.toFixed(7) +
      ' (imp-3172 Config-B smooth onset, the lowest computationally located ' +
      'onset) and c_asym = ' + C_ASYM.toFixed(10) +
      ' (the asymmetric R-to-infinity class, imp-3170). Both are witnesses ' +
      'that upper-bound the infimum; they are not a rigorous lower/upper bracket. ' +
      'The Theorem-C basin (C_Lip) only requires c <= 0.72, so closing c_glob is NOT needed ' +
      'for the current load-bearing Lipschitz argument — the observed range matters for the program ' +
      'isolation record, not for the core proof chain.',
      'Turning the observations into a bracket requires either a proven lower ' +
      'bound or a structured search that exhausts the class and certifies the infimum.',
    ],
    links: [
      { to: '/onset-bracket-ledger', label: 'Onset Bracket Ledger' },
      { to: '/spectral-attack', label: 'Spectral Attack (c_glob viz)' },
    ],
  },
  {
    id: 'G6a',
    tag: 'step-4-polymath15-bridge',
    color: '#22d3ee',
    badge: 'PARTIAL CLOSURE',
    title: 'G6a: Step-4 Polymath15 bridge — G6a_shock_lipschitz',
    status: 'OPEN (PARTIAL)',
    body: [
      'The Polymath15 route to Λ <= 0 requires a rigorous Hölder-1/2 (Lipschitz) bound on ' +
      'the Burgers shock modulus C_H in G6a_shock_lipschitz. imp-354 partially reduced the ' +
      'gap from "full Hölder-1/2 lemma missing" to two sub-sub-gaps: ' +
      'G6a-sub-hyperbolic (hyperbolic region bound) and G6a-sub-constant (constant region). ' +
      'Per imp-2640 NEGATIVE, C_H is undischargeable via the current approach, so the ' +
      'finite-N beat on Lambda remains an ESTIMATE, not a rigorous unconditional result. ' +
      'The peer-reviewed benchmark remains Lambda <= 0.2; separately, this repository ' +
      'now proves the unreviewed computer-assisted theorem Lambda <= 0.1787854 through ' +
      'an independent sealed route. That theorem does not close G6a or descend to zero.',
      'Closing G6a fully requires the actual missing strip-uniform fold estimate or one ' +
      'of the parallel routes (imp-368+369+336 Route A, or imp-342+337 Route C). ' +
      'Those routes remain open.',
      'Citation audit (imp-33637): arXiv:1904.12438 contains only Lemma 5.1 in ' +
      'Section 5, not a Lemma 5.2 matching this Hölder-1/2 claim. imp-33649 ' +
      'traced the fold-catastrophe exponent instead to Whitham, Linear and ' +
      'Nonlinear Waves (1974). The nonexistent lemma is not a live closure ' +
      'route; G6a_shock_lipschitz remains OPEN (PARTIAL).',
      'Honest-status note (imp-33766): H4 (the strip-height fold-reading derivative m_prime) ' +
      'is NOT independently dischargeable -- the Holder-modulus back-conversion couples it to ' +
      'H3 (the curvature coefficient m_double_prime) through the same quadratic fold expansion, ' +
      'and H3 dominates H4 a fortiori. H4 and H3 therefore collapse into ONE coupled ' +
      'strip-height-uniformity object, load-bearing at the H3 rung; this is scoping only and ' +
      'discharges nothing, so G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above.',
      'Honest-status note (imp-33794): the measured finite-band C_ren(N) window (the renormalized ' +
      'fold-reading amplitude across the eps = y_N^sharp ladder) is CONSISTENT-WITH the H4 ' +
      'finite-window minimal-input requirement but does NOT DISCHARGE H4 -- the uniform bound needs ' +
      'the ANALYTIC tracking of C_ren through the fold-modulus back-conversion, not an empirical ' +
      'band checked on a finite ladder, and it says nothing about the coupled H3 curvature rung ' +
      '(imp-33786) that dominates and jointly governs discharge. Measurement only; ' +
      'G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above.',
      'Honest-status note (imp-35101, sharpening imp-3671): the direct-flow V0(gamma) route carries two ' +
      'INDEPENDENT obstructions, not one -- S1 (V0 is a strip-sup density scalar, the wrong TYPE of object for the ' +
      'required two-point spatial modulus |tau_c(x) - tau_c(x_prime)| <= C_Lip|x - x_prime|^{1/2}) and S2, now sharpened ' +
      'from merely Gronwall-vacuous to the wrong MONOTONE DIRECTION: tau_c is set by the nearest pair -- the ' +
      'HIGHEST-density region -- exactly where a density FLOOR carries no information. Retyping V0 to fix S1 does not ' +
      'fix S2; the only object fixing both is a minimal-gap LOWER bound, which is itself the RH-hard nearest-pair ' +
      'control (imp-2520/imp-348, GUE-conditional per imp-486). Separately, per imp-2640 the direct Gronwall discharge ' +
      'of C_H remains NEGATIVE, and the asymptotic modulo (imp-35056) persists regardless of route. No candidate ' +
      'closure via the density-floor measurement exists; G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above; ' +
      'changes no bound; NO QED.',
    ],
    links: [
      { to: '/rh-dag', label: 'Proof DAG (G6a node)' },
      { to: '/lambda-bounds', label: 'Lambda Bounds' },
      { to: '/route-map', label: 'Route Map' },
    ],
  },
];

export default function OpenFrontierPage() {
  return (
    <div className="page">
      <PageHeader
        title="Open Frontier"
        subtitle="One exact global RH-equivalent frontier, with separate subsidiary research lanes"
      />

      <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid #64748b' }}>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.65 }}>
          The canonical global frontier is the exact T3 residual below. It is the
          current full-strength Twin Ladder formulation of RH and is not yet a
          simplification of RH. The R1, R2, and G6a questions remain useful
          research inside a distinct Dyson / collision-flow lane, but they are
          not the complete global gap and do not replace T3.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 22, borderLeft: '4px solid #38bdf8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: '#7dd3fc',
              border: '1px solid #38bdf8',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            LATEST AUDITED CHECKPOINT
          </span>
          <code style={{ fontSize: 11, color: '#94a3b8' }}>T47–T106 · 2026-07-28</code>
        </div>
        <h2 style={{ color: '#e0f2fe', fontSize: 15, margin: 0 }}>
          What the resumed Twin Ladder attack actually established
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.65, margin: '8px 0 12px' }}>
          These are proved equivalences, relays, and tail theorems. None supplies
          the missing arithmetic bound, and RH remains open.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))',
            gap: 10,
          }}
        >
          {LATEST_TWIN_LADDER_CHECKPOINT.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '12px 13px',
                borderRadius: 7,
                background: `${item.color}0d`,
                border: `1px solid ${item.color}40`,
                minWidth: 0,
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <code style={{ color: item.color, fontSize: 12, fontWeight: 800 }}>{item.id}</code>
                <span
                  style={{
                    color: item.color,
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: 9.5,
                    fontWeight: 700,
                    letterSpacing: 0.3,
                  }}
                >
                  {item.status}
                </span>
              </div>
              <h3 style={{ color: '#e2e8f0', fontSize: 12.5, margin: '7px 0 0' }}>
                {item.title}
              </h3>
              <code
                style={{
                  display: 'block',
                  color: '#cbd5e1',
                  fontSize: 10.5,
                  lineHeight: 1.5,
                  marginTop: 8,
                  padding: '7px 8px',
                  borderRadius: 5,
                  background: 'rgba(15,23,42,0.52)',
                  overflowX: 'auto',
                }}
              >
                {item.formula}
              </code>
              <p style={{ color: '#94a3b8', fontSize: 11.5, lineHeight: 1.55, margin: '8px 0 0' }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: `4px solid ${GLOBAL_FRONTIER.color}` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: GLOBAL_FRONTIER.color,
              border: `1px solid ${GLOBAL_FRONTIER.color}`,
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {GLOBAL_FRONTIER.badge}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              color: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: 4,
              padding: '1px 6px',
            }}
          >
            {GLOBAL_FRONTIER.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>{GLOBAL_FRONTIER.tag}</code>
        </div>
        <strong style={{ color: '#f8fafc', fontSize: 15, display: 'block', marginBottom: 10 }}>
          {GLOBAL_FRONTIER.title}
        </strong>
        <div
          style={{
            marginBottom: 12,
            padding: '10px 12px',
            borderRadius: 6,
            background: 'rgba(239,68,68,0.07)',
            color: '#fecaca',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 13,
            overflowX: 'auto',
          }}
        >
          D<sub>a,R</sub> + K<sub>a</sub><sup>(S)</sup> ⪰ −K<sub>a,0</sub>
        </div>
        {GLOBAL_FRONTIER.body.map((para, i) => (
          <p key={i} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
            {para}
          </p>
        ))}
        <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {GLOBAL_FRONTIER.links.map((lnk) => (
            <Link
              key={lnk.to}
              to={lnk.to}
              style={{ fontSize: 12, color: GLOBAL_FRONTIER.color, textDecoration: 'none', borderBottom: `1px solid ${GLOBAL_FRONTIER.color}` }}
            >
              {lnk.label} →
            </Link>
          ))}
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: '4px solid #f59e0b' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: '#fbbf24',
              border: '1px solid #f59e0b',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>T11 · exact Riemann kernel</code>
        </div>
        <strong style={{ color: '#fde68a', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {CHANNEL_SPLIT_CERTIFICATE.title}
        </strong>
        <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          On the certified block <code>{CHANNEL_SPLIT_CERTIFICATE.configuration}</code>,
          the coupled matrix K<sub>a,0</sub> + D<sub>a,R</sub> +
          K<sub>a</sub><sup>(S)</sup> is positive definite. Separate
          scalar-multiple estimates D<sub>a,R</sub> ⪰ −β<sub>R</sub>K<sub>a,0</sub> and
          K<sub>a</sub><sup>(S)</sup> ⪰ −β<sub>S</sub>K<sub>a,0</sub> must obey:
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 8,
            margin: '12px 0',
          }}
        >
          {[CHANNEL_SPLIT_CERTIFICATE.betaR, CHANNEL_SPLIT_CERTIFICATE.betaS, CHANNEL_SPLIT_CERTIFICATE.betaSum].map((value) => (
            <code
              key={value}
              style={{
                padding: '8px 10px',
                borderRadius: 5,
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#fde68a',
                fontSize: 12,
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          The radial witness is stronger: <code>{CHANNEL_SPLIT_CERTIFICATE.radialFullCore}</code>.
          Any PSD partition P<sub>R</sub> + P<sub>S</sub> = G<sub>0</sub> has
          P<sub>R</sub> ⪯ G<sub>0</sub>, so that same witness remains negative
          after every matrix-valued radial suballocation. This refutes all
          independent PSD partitions of the same core, not the coupled T3
          inequality or RH. On that same witness, the exact interval certificate
          isolates the shear rescue as <code>{CHANNEL_SPLIT_CERTIFICATE.compensation}</code>.
          The live target is direct radial/shear cancellation, a genuinely new
          positive resource, or a different zeta-specific mechanism.
        </p>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.65, margin: '10px 0 0' }}>
          {CHANNEL_SPLIT_CERTIFICATE.coupledTarget}
        </p>
        <p style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.55, margin: '10px 0 0' }}>
          Certificate method: {CHANNEL_SPLIT_CERTIFICATE.method}.
        </p>
        <div
          style={{
            marginTop: 14,
            padding: '12px 14px',
            borderRadius: 7,
            background: 'rgba(14,165,233,0.06)',
            border: '1px solid rgba(56,189,248,0.22)',
          }}
        >
          <strong style={{ color: '#7dd3fc', fontSize: 13 }}>
            Confluent derivative-jet refinement
          </strong>
          <p style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.65, margin: '8px 0 0' }}>
            The obstruction survives after all evaluation points coalesce:
            <code style={{ marginLeft: 5 }}>{CHANNEL_SPLIT_CERTIFICATE.jetConfiguration}</code>.
            At order two, <code>{CHANNEL_SPLIT_CERTIFICATE.jetOrder2}</code>, while the
            full core/radial/shear jet is positive definite. One exact rational
            direction records the same-vector channel rescue:
          </p>
          <code
            style={{
              display: 'block',
              marginTop: 8,
              padding: '7px 9px',
              borderRadius: 5,
              color: '#bae6fd',
              background: 'rgba(14,165,233,0.08)',
              fontSize: 11.5,
              overflowX: 'auto',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.jetOrder2Rescue}
          </code>
          <p style={{ color: '#94a3b8', fontSize: 12.5, lineHeight: 1.65, margin: '9px 0 0' }}>
            Order four is stricter: under one fixed rational, basis-dependent
            Schur/LDL split, <code>{CHANNEL_SPLIT_CERTIFICATE.jetOrder4}</code>.
            Core plus shear plus N has a negative witness; restoring Q gives the
            positive-definite full jet and flips that witness:
          </p>
          <code
            style={{
              display: 'block',
              marginTop: 8,
              padding: '7px 9px',
              borderRadius: 5,
              color: '#bae6fd',
              background: 'rgba(14,165,233,0.08)',
              fontSize: 11.5,
              overflowX: 'auto',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.jetOrder4Rescue}
          </code>
          <p style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.55, margin: '9px 0 0' }}>
            This refutes discarding that positive radial component before
            estimating the negative component. It is not a universal statement
            about every radial split and does not prove T3 or RH. Certificate
            method: {CHANNEL_SPLIT_CERTIFICATE.jetMethod}.
          </p>
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: '4px solid #a78bfa' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: '#c4b5fd',
              border: '1px solid #8b5cf6',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {ONE_POINT_JET_HIERARCHY.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>T13–T15 · full coupled kernel</code>
        </div>
        <strong style={{ color: '#ddd6fe', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {ONE_POINT_JET_HIERARCHY.title}
        </strong>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          {ONE_POINT_JET_HIERARCHY.caveat}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 8,
            margin: '12px 0',
          }}
        >
          {[ONE_POINT_JET_HIERARCHY.fixedA, ONE_POINT_JET_HIERARCHY.sequence].map((value) => (
            <code
              key={value}
              style={{
                padding: '9px 10px',
                borderRadius: 5,
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(167,139,250,0.25)',
                color: '#ddd6fe',
                fontSize: 11.5,
                overflowX: 'auto',
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: '#a78bfa', fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
          {ONE_POINT_JET_HIERARCHY.finiteWarning}
        </p>
        <p style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.55, margin: '9px 0 0' }}>
          A single fixed-a hierarchy may also be weaker than strict
          Hermite–Biehler positivity when shifted zeros cancel. The exact
          RH-equivalent obligation remains the all-order hierarchy along
          thicknesses tending to zero; neither the current finite certificates
          nor this reformulation proves RH.
        </p>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: '4px solid #14b8a6' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: '#5eead4',
              border: '1px solid #14b8a6',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {MARKOV_NORMALIZATION.status}
          </span>
          <code style={{ fontSize: 11, color: '#64748b' }}>T18–T106 · Markov / divisor / explicit-formula frontier</code>
        </div>
        <strong style={{ color: '#99f6e4', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {MARKOV_NORMALIZATION.title}
        </strong>
        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          {MARKOV_NORMALIZATION.structure}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 8,
            margin: '12px 0',
          }}
        >
          {[
            MARKOV_NORMALIZATION.rowMass,
            MARKOV_NORMALIZATION.equivalence,
            MARKOV_NORMALIZATION.sameSign,
            MARKOV_NORMALIZATION.divisor,
            MARKOV_NORMALIZATION.sequence,
            MARKOV_NORMALIZATION.outer,
            MARKOV_NORMALIZATION.halfAnchor,
            MARKOV_NORMALIZATION.poisson,
            MARKOV_NORMALIZATION.dyadic,
            MARKOV_NORMALIZATION.crossScale,
            MARKOV_NORMALIZATION.crossScaleScope,
            MARKOV_NORMALIZATION.landen,
            MARKOV_NORMALIZATION.explicitFormula,
            MARKOV_NORMALIZATION.compensatedPrime,
            MARKOV_NORMALIZATION.tempered,
            MARKOV_NORMALIZATION.weightedPnt,
            MARKOV_NORMALIZATION.oneSidedRung,
            MARKOV_NORMALIZATION.primeRiesz,
            MARKOV_NORMALIZATION.scaleAverage,
            MARKOV_NORMALIZATION.squareScale,
            MARKOV_NORMALIZATION.jacobiHeat,
            MARKOV_NORMALIZATION.jacobiDeconvolution,
            MARKOV_NORMALIZATION.primeRenewal,
            MARKOV_NORMALIZATION.thetaFeatures,
            MARKOV_NORMALIZATION.phaseSpace,
            MARKOV_NORMALIZATION.finiteHeight,
            MARKOV_NORMALIZATION.finiteHeightSchur,
            MARKOV_NORMALIZATION.pascalCriterion,
            MARKOV_NORMALIZATION.firstRadix,
            MARKOV_NORMALIZATION.fixedMajorant,
            MARKOV_NORMALIZATION.adaptiveSelberg,
            MARKOV_NORMALIZATION.endpointModel,
            MARKOV_NORMALIZATION.radicalKernel,
            MARKOV_NORMALIZATION.adaptiveEndpoint,
            MARKOV_NORMALIZATION.graphCore,
            MARKOV_NORMALIZATION.carryRow,
            MARKOV_NORMALIZATION.blockAverage,
            MARKOV_NORMALIZATION.carryObstruction,
            MARKOV_NORMALIZATION.positivePotential,
            MARKOV_NORMALIZATION.potentialBlock,
            MARKOV_NORMALIZATION.carryThreshold,
            MARKOV_NORMALIZATION.primeTransport,
            MARKOV_NORMALIZATION.transportEquivalence,
            MARKOV_NORMALIZATION.centeredTransport,
            MARKOV_NORMALIZATION.positiveReset,
            MARKOV_NORMALIZATION.sampledPhase,
            MARKOV_NORMALIZATION.squareKernel,
            MARKOV_NORMALIZATION.outerSmoothing,
            MARKOV_NORMALIZATION.sublinearBootstrap,
            MARKOV_NORMALIZATION.squareKernelBallot,
            MARKOV_NORMALIZATION.signedHaar,
            MARKOV_NORMALIZATION.harmonicCompensation,
            MARKOV_NORMALIZATION.adaptiveDriftSplit,
            MARKOV_NORMALIZATION.primePowerRenormalization,
            MARKOV_NORMALIZATION.dilationHarmonicLadder,
            MARKOV_NORMALIZATION.positiveAnnularComparator,
            MARKOV_NORMALIZATION.dilationHarmonicResponse,
            MARKOV_NORMALIZATION.annularArithmetic,
            MARKOV_NORMALIZATION.geometricAnnulus,
            MARKOV_NORMALIZATION.jointAnnulus,
            MARKOV_NORMALIZATION.verifiedZeroAnnulus,
            MARKOV_NORMALIZATION.factorwiseAnnularBarrier,
            MARKOV_NORMALIZATION.allSplineFloor,
            MARKOV_NORMALIZATION.sharperVerifiedZeroAnnulus,
            MARKOV_NORMALIZATION.crossFactorCarry,
            MARKOV_NORMALIZATION.unconditionalAnnularRecurrence,
            MARKOV_NORMALIZATION.deepAnnularBlocks,
            MARKOV_NORMALIZATION.sharperCrossFactorCarry,
            MARKOV_NORMALIZATION.proportionalCarryBuffer,
            MARKOV_NORMALIZATION.beattyCarryTransducer,
            MARKOV_NORMALIZATION.localCarryFilter,
            MARKOV_NORMALIZATION.localFilterConditioning,
            MARKOV_NORMALIZATION.multiplicativePoleNotches,
            MARKOV_NORMALIZATION.realPhaseConditioning,
            MARKOV_NORMALIZATION.finiteModes,
            MARKOV_NORMALIZATION.gaussian,
            MARKOV_NORMALIZATION.finiteOrderSmoothing,
            MARKOV_NORMALIZATION.cellQuotient,
            MARKOV_NORMALIZATION.gradedBackward,
            MARKOV_NORMALIZATION.finiteRadialLayers,
            MARKOV_NORMALIZATION.continuumTail,
            MARKOV_NORMALIZATION.criticalTail,
            MARKOV_NORMALIZATION.levy,
            MARKOV_NORMALIZATION.edge,
            MARKOV_NORMALIZATION.douglas,
            MARKOV_NORMALIZATION.hankel,
            MARKOV_NORMALIZATION.infinitesimal,
            MARKOV_NORMALIZATION.boundary,
            MARKOV_NORMALIZATION.cubic,
          ].map((value) => (
            <code
              key={value}
              style={{
                padding: '9px 10px',
                borderRadius: 5,
                background: 'rgba(20,184,166,0.08)',
                border: '1px solid rgba(45,212,191,0.25)',
                color: '#ccfbf1',
                fontSize: 11.5,
                overflowX: 'auto',
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: '#5eead4', fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
          {MARKOV_NORMALIZATION.routeAudit}
        </p>
        <p style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.55, margin: '9px 0 0' }}>
          Sharpened surviving target: either prove the exact full-theta same-sign block
          𝒜<sub>aₙ</sub> is positive at infinitely many points of one explicit sequence
          a<sub>n</sub> → 0, or construct the positive half-Poisson measure directly from
          the Jacobi theta ratio. A strict intermediate target is now explicit: prove
          temperedness of e<sup>λ|u|</sup>c(u) for one 0 &lt; λ &lt; 1 to obtain a
          uniform zero strip, then increase λ toward one. A concrete first-rung route is
          the prime-only T44 lower bound
          4(x<sup>1/4</sup>−1) − Σ<sub>p≤x</sub>(log p)p<sup>−3/4</sup>
          ≥ −C(1+log x)<sup>N</sup>, which would force the strip [1/4, 3/4].
          Its forward and causal Riesz smoothings are lossless; proving the causal
          version with the weaker power x<sup>1/8</sup> would already force the new
          strip [1/8, 7/8]. T47 makes this exactly the no-log triangular prime
          inequality displayed above. The continuum radial tail now has fixed-order
          principal positivity uniformly through clustered and unbounded gaps, but
          its threshold depends on the matrix order and far-separated cross minors
          remain negative. Positive all-integer scale completion cancels the complete
          zero divisor; T49 isolates the required signed Mertens cancellation. T50
          preserves the right-hand poles on square scales and exposes prime-times-square support,
          but absolute averaging is boundedly invertible and supplies no descent.
          T51 makes that support an exact positive Twin Ladder/Jacobi heat trace
          whose associated differentiated carrier is a positive translate mixture;
          T52 shows that its raw positivity, complete monotonicity, and modular
          splitting are consumed by the main term and do not center the error. T53
          shows that causal Jacobi smoothing preserves every forbidden pole but is
          exponentially ill-conditioned, with a smooth positive-PNT countermodel to
          generic pointwise deaveraging. T54 proves that exact prime-power renewal
          contributes only a constant and a vanishing cusp. T55 shows that the
          half-sech continuum limit has no spectral floor: fixed-order tail positivity
          cannot be promoted by fixed-C<sup>m</sup> control, and tail PSD of the exact
          analytic kernel is already its global fixed-thickness divisor condition. T56
          refutes every finite signed upper half-sech relative bound with a positive
          finite evaluation witness; that sign still does not decide PSD. T57 identifies the exact feature
          and phase-space quotient with the completed-ξ boundary condition, so the
          one-sided endpoint-compressed contraction remains the live continuum target.
          T58 transfers the imported verified height only to a finite range; T59 gives
          an RH-equivalent Pascal-row comparator; and T60 excludes every fixed strict
          PNT-admissible majorant. An x-dependent family with target-scale uniform
          sampling would need vanishing excess (and, for standard bandlimited
          extremal families, growing bandwidth). T61 turns the verified height into a
          genuine Schur/Pick window only with the conformal sinh denominator; the
          natural 2×2-indefinite bridge does not recover the original global kernel.
          T62 removes every higher radix layer from the Pascal statement, leaving a
          prime-only first-layer sign that is still exactly RH-equivalent and open.
          T63 supplies the canonical adaptive Selberg family at Ω ≍ x<sup>1/8</sup>,
          but its centered sampling inequality is still exactly T47; the same no-gain
          inequality holds for every tight positive adaptive majorant. T64 writes the
          endpoint defect as a residual-pole model space minus a base-zero model
          space; fixed bands lose poles escaping in height, and strip-Schur
          positivity alone does not sign the original endpoint kernel. T65 identifies
          the first-radix radical quotient and its Mellin kernel: it cancels the PNT
          pole but retains every zeta-zero obstruction, with no eventual monotonicity
          or log-convexity shortcut. T68 factorizes that quotient into a squarefree
          least-digit carry row whose product is compared with a primorial staircase;
          factorwise Pascal divisibility gives no coordinatewise sign. T69 replaces
          pointwise row domination by a critical √N/log N consecutive-row average,
          but that averaged condition is still RH-equivalent and unproved. T70 shows
          that uniform/all-N block-column monotonicity, primewise residue averaging,
          and the uniform local Pascal loss cannot prove it; eventual column structure
          and other global mechanisms remain open. T71 packages the defect as integer right tangents of
          a nonnegative potential converging to γ<sub>E</sub>/2, but the potential’s
          prime component can decrease and supplies no tangent sign. T72 derives the exact affine
          unit-cell drift, positive radical resets, and critical-block quadrature; its
          continuum, sampled, and terminal-maximum targets are still RH-equivalent.
          T73 confines positive carry exponents above √N and shows that fixed lower
          harmonic cells and uniform/all-N weak log-majorization do not prove the sign. T74 brackets
          the complete low-prime load and identifies one-wrap reset and entrant terms,
          while T75 proves its eventual critical-window Q<sub>+</sub> condition is
          RH-equivalent and therefore not an asymptotic reduction. T76 residue-centers
          that load to an O(H<sup>3</sup>) corridor and collapses reset intervals into
          weighted truncated radicals; its critical lower edge remains RH-equivalent.
          T77 absorbs every wrap and entrant into a nonnegative correction, but the
          signed baseline contains the original first-radix defect and the critical
          average differs from it by only O(N<sup>3/2</sup>/log N).
          T78 sharpens the one-sided increment to D<sub>N</sub>≤(𝔮+o(1))N
          and classifies sampled recovery: a gap N<sup>δ</sup> with deficit
          N<sup>κ</sup> forces Re ρ≤max(1/2, δ, κ−3/2). In particular,
          RH is equivalent to one nonnegative centered checkpoint in every
          sufficiently late outer interval [N,N+√N]. Exact failures at starts
          125 and 126 keep the qualifier “eventually” load-bearing.
          T79 identifies the local arithmetic behind those samples:
          D<sub>n</sub>/n=𝔮−log(n/rad n)+o(1), so a density 7/π² of
          sufficiently late steps is positive. Their N<sup>3/2</sup>
          mass is canceled by the square-kernel spikes, leaving every
          outer √N window o(N<sup>3/2</sup>)-flat around the inherited
          pointwise defect. T80 then shows that every nonnegative
          averaging rule on a fixed C<sub>0</sub>√N window retains that
          same baseline. In the uniform convolution, periodicity saves
          one logarithm in the modular covariance, but each fixed zero mode still has multiplier
          1+O<sub>ρ</sub>(N<sup>−1/2</sup>), so the smoothed sign remains
          RH-equivalent.
          T81 feeds the square-kernel estimate back through the
          provisional zero strip. For every fixed 0≤δ&lt;1 and κ&lt;5/2,
          the existence of some C and one checkpoint
          Ξ≥−CM<sup>κ</sup> in every sufficiently late
          [N,N+⌊N<sup>δ</sup>⌋] interval forces
          Re ρ≤max(1/2, κ−3/2); the apparent gap exponent from the
          one-pass T78 estimate contracts away. Thus even a
          nearly linear fixed-power search window is valid for an
          RH-equivalent sign target. The theorem does not supply the
          checkpoint, and no contraction remains at δ=1.
          T82 evaluates the most natural signed ballot of the
          repeated-prime word exactly:
          H<sub>N</sub>=(N−1)J<sub>N</sub>−2Σ<sub>m&lt;N</sub>J<sub>m</sub>
          =Σ<sub>n≤N</sub>(2n−N−1)b(n)≥0. This is the higher-radix
          correction already present in the Pascal decomposition.
          It helps the full Pascal quantity ℓ<sub>N</sub>, but is
          subtractive in L<sub>N</sub><sup>(1)</sup>=ℓ<sub>N</sub>−H<sub>N</sub>
          and varies by only o(N<sup>3/2</sup>) across every fixed
          sublinear power window. The local b-word directly uses only
          primes below √(N+N<sup>δ</sup>); the complementary high-prime
          first-layer sum differs from L<sub>N</sub><sup>(1)</sup> by
          O(N<sup>3/2</sup>) and therefore retains the exact zero-strip
          lower-bound criterion. This identifies a method-specific
          blind channel; it neither proves independence nor supplies
          the missing RH sign.
          T83 tests signed mass-zero cancellation. For fixed inner
          height, adjacent equal outer blocks have exact positive-tent
          increment weights; each fixed zero mode loses a factor
          Y/N, or half a power at Y≈√N. The transformed coefficients
          are proportional to 1/ρ and are not absolutely summable.
          Reconstructing a level from consecutive adaptive √N-block
          means restores the lost exponent: if, for 0≤κ≤3/2,
          A<sub>r+1</sub>−A<sub>r</sub>≥−Cn<sub>r</sub><sup>κ</sup>
          eventually, then every zero satisfies
          Re ρ≤max(1/2, κ−1/2). The κ=1 drift target would therefore
          prove RH, but it is unproved and no converse is known; the
          fixed-height covariance estimate also does not silently
          transfer to varying inner heights.
          T84 resolves the high-prime blind channel into exact
          harmonic cells. The positive N<sup>2</sup>/8 top-cell main
          mass is canceled successively by the lower cells, leaving
          N<sup>2</sup>K/[2(K+1)<sup>2</sup>] plus a centered
          quadrature error. Quantitative PNT estimates control this
          only for subpower K. At K≈√N, that centered error has exactly
          the original zero-strip lower-bound criterion, including RH
          at scale N<sup>3/2</sup>; the apparent top-cell subsidy is
          therefore not an independent reserve.
          T85 then decomposes the actual unequal-width adaptive drift:
          A<sub>r+1</sub>−A<sub>r</sub>=−Δ<sub>r</sub>V<sub>θ</sub>
          −Δ<sub>r</sub>H+Δ<sub>r</sub>Γ. The Pascal term is only
          O(√N log N), while a refined prime-power divisor switch gives
          |Δ<sub>r</sub>H|≪N<sup>4/3</sup>(log N)<sup>1/3</sup>.
          The remaining prime-error bound
          Δ<sub>r</sub>V<sub>θ</sub>≤CN log<sup>2</sup>N is itself
          RH-equivalent. A direct cross-channel estimate
          Δ<sub>r</sub>H+Δ<sub>r</sub>V<sub>θ</sub>≤CN(log N)<sup>A</sup>
          would prove RH, but it remains unproved.
          T86 completes the prime channel by writing
          W<sub>N</sub>=V<sub>ψ</sub>(N)−V<sub>θ</sub>(N) and
          K<sub>N</sub>=H<sub>N</sub>−W<sub>N</sub>. Then
          V<sub>θ</sub>+H=V<sub>ψ</sub>+K exactly. The proposed
          N·polylog cross bound is equivalent to RH together with a
          separate one-sided N·polylog bound for Δ<sub>r</sub>K.
          Mellin renewal copies in K occur at scaled locations ρ/j,
          not at the original right-half zero pole ρ, so they do not
          cancel the zero-complete V<sub>ψ</sub> mode by mode.
          Fixed equal-width repeated-prime tents have rigorous
          natural-density variance ≫√H log H, but this limit fixes H
          before averaging N. It does not reach the diagonal H≈√N,
          the sparse adaptive starts, or the required one-sided bound.
          The result is a sharper obstruction map, not an RH proof.
          T87 extends the variance identity to every finite signed
          filter. For the adaptive ladder begun at 4, the starts in a
          dyadic square epoch form an explicit zero-density quadratic
          set and omit residue 3 modulo 4, so the natural-density
          theorem cannot simply be restricted to those starts.
          A fixed macroscopic dilation does escape the separate radix
          condition:
          𝔇<sub>a</sub>F(N)=N<sup>−1/2</sup>
          [F(aN)−a<sup>3/2</sup>F(N)]. The higher-radix channel is
          O(N), and Re ρ≤σ is equivalent to
          𝔇<sub>a</sub>V<sub>θ</sub>(N)≤CN<sup>σ+1/2</sup> at every
          sufficiently large integer. At σ=1/2 this is RH-equivalent,
          not a proof; the surviving prime expression is a signed
          weighted-PNT remainder. Separately, RH proves eventual
          positivity of the harmonic channel at depth N<sup>α</sup>
          for α&lt;1/3, while the α=1/8 sign implies the T47 strip.
          No unconditional polynomial-depth sign is proved.
          T88 sharpens the nonlocal route into a positive annular
          comparator. For
          L<sub>+</sub>F(N)=F(4N)−3F(2N)+2F(N), every prime
          p≤N cancels and the remaining weights are nonnegative:
          2(p−N) on (N,2N] and 4N−p on (2N,4N]. RH is equivalent to
          their weighted log-prime sum being at most 3N<sup>2</sup>
          eventually. Under RH the prime-square mode gives the strict
          deficit (0.155951…−o(1))N<sup>3/2</sup>, larger than the
          total possible critical-zero wave. The converse recovers a
          one-sided first-Riesz bound and hence RH. This is a strict
          prime-only localization, not an unconditional proof of its
          sign.
          T89 identifies why canceling that square mode does not
          improve the target. For every finite dilation, the 3/2 notch
          is the zero moment ∫w(u)u<sup>−1/2</sup>du=0, forcing every
          nonzero prime spline to change sign. The exact localized
          four-scale notch
          F(64N)−13F(16N)+44F(4N)−32F(N) preserves all off-critical
          zeros and has recurrent positive and negative
          N<sup>3/2</sup>-scale values on RH. Independently, the exact
          polynomial-depth harmonic response tends to
          1/[ρ(ρ+1)] for every fixed zero: cross-cell summation removes
          a termwise K-loss but restores the original zero mode.
          Neither mechanism proves RH. T90 gives the T88 annulus an
          exact arithmetic form: its full Λ-weighted value is one lcm
          quotient, factored into nonnegative prime-power layers. RH
          is equivalent to bounding that quotient by its explicit
          prime-square layer after the deterministic main term.
          The square factor cancels, but cubes and higher remain as a
          nonnegative O(N<sup>4/3</sup>) penalty. The square-only form
          is therefore a pointwise strengthening whose extra cost is
          absorbed by the conditional N<sup>3/2</sup> margin. The parallel annular
          Pascal-row comparator is exact; its natural central-binomial
          divisibility majorant overshoots the target by
          (6log2−3)N<sup>2</sup>. T91 then improves the actual
          localization. In the zero-complete geometric family
          Q<sub>a</sub>(s)=(a<sup>s</sup>−1)
          (a<sup>s</sup>−a), a certified RH margin exists once
          a&gt;1.882453339…. Choosing a=17/9 gives a positive tent
          supported only on (81N,289N], with ratio 289/81&lt;4 and
          deficit 48.820170…N<sup>3/2</sup> under RH. The resulting
          eventual prime inequality is still RH-equivalent and
          unproved. T92 shows that two generic positive tents can
          remove each other&apos;s blind zeros: the explicit
          c=124/123 pair is jointly zero-complete at support
          3.4517217537, and 3.4513363850 is the sharp support floor
          for finite nonnegative piecewise-linear annular kernels when
          every zero is charged at the global worst-case amplitude;
          T95&apos;s signed-curvature decomposition proves that
          nonconcavity only spends more amplitude.
          T93 breaks that method floor by charging the
          first 1,000 rigorously isolated zeros individually. The
          single geometric choice a=23/15 gives an RH-equivalent
          positive tent on (225N,529N], support ratio
          529/225=2.351111…, and a certified conditional deficit
          above 50.625N<sup>3/2</sup>. It still does not prove the
          eventual prime sign. T94 then rules out the direct rowwise
          factorial rescue: every factorwise multinomial cover pays
          at least 2log2 per unit primorial-index gap, an
          order-N<sup>2</sup> overcharge that prime-power corrections
          cannot repair. Any continuation of this arithmetic cofactor
          route therefore needs cross-factor carry transport or
          cancellation. T96 spends the first 50,000 rigorously
          isolated zeros individually. The a=32/21 tent is supported
          on (441N,1024N], has ratio 1024/441=2.321995…, and keeps a
          certified conditional deficit above
          136.1367N<sup>3/2</sup>. Its eventual prime inequality
          remains unproved. T97 gives the requested cross-factor
          arithmetic display: the T93 cofactor is exactly an adjacent
          Pascal/carry mean comparison. Prime/composite jumps, an
          infinite negative 3-adic valuation family, and exact
          negative local factors rule out the tested monotonicity,
          direct-divisibility, and universal pair/per-block positivity
          shortcuts without deciding the global sign. T98 proves that
          the T93 slack is unconditionally
          negative for infinitely many integer scales, and a separate
          interval certificate puts its full inverse-cubic average
          below −25,000. T99 sharpens the recurrence: the real
          prime-square pole forces deep N<sup>3/2</sup> negative
          checkpoints for both certified annuli, and explicit PNT
          control expands infinitely many of them into consecutive
          blocks of length
          √N·exp(0.8√log N). Their gaps are not controlled. T100
          gives the exact 32/21 Pascal/carry comparator for the
          sharpest annulus; two infinite negative valuation families,
          exact negative local factors, and N<sup>2</sup>-scale cover
          gaps leave aggregate cross-factor transport as the open
          route tested here. T101 then packages both sharp annuli into
          the exact proportional buffer
          F<sub>r,s</sub>(k)=Σ<sub>h=k</sub><sup>⌊rk/s⌋−1</sup>
          q<sub>r,s</sub>(h). At aligned scales this is precisely
          log(S<sub>N</sub>/C<sub>N</sub>); at every other scale it is
          a nonnegative trapezoidal prime/Pascal kernel. Its endpoint
          dilation polynomial has zeros only on Re z=0 and Re z=1.
          Every fixed residue lane is still RH-equivalent, while T99
          supplies infinitely many consecutive buffer-positive
          intervals of length s√N·exp(0.8√log N)+O(1). Exact negative
          q-blocks prevent termwise induction, and the proposed full
          stop-loss order contains the original RH-complete terminal
          sum. T102 exposes the common rational Beatty word pattern:
          both ratios obey 2r=3s+1, the floor increments follow
          (1,2)<sup>m</sup>,2, and ΔF=(𝒯−I)q. The operator conserves
          complete q-block mass, but exact rational counterfixtures
          refute the global all-k forms of ordinary and orbit
          monotonicity, 𝒯q≥q, subadditivity, and superadditivity.
          Eventual versions remain unexcluded. T103 then proves a
          quantitative no-smoothing theorem: every normalized
          bounded-ℓ<sup>1</sup> signed filter on a
          k<sup>δ+o(1)</sup> window forces
          Re ρ≤max(1/2,δ) if its sign is eventually nonnegative.
          Through δ=1/2—including the T99/T101 block length—the
          filtered sign is still RH-equivalent. T104 adds the
          conditioning budget: for normalized mass-one additive
          filters, if the window exponent is δ and the
          coefficient-ℓ<sup>1</sup> exponent is τ, fixed-factor
          attenuation of even one fixed zeta-pole transfer amplitude
          along an unbounded sequence requires δ+τ≥1. Below that
          threshold each fixed normalized response tends to one.
          This leaves cross-mode cancellation, growing-height modes,
          multiplicative windows, and nonlinear global transforms
          outside the classification. None of T99–T104
          controls the gaps or supplies an eventual sign.
          T105 moves to fixed multiplicative scale: a convex filter
          can cancel the continued Mellin poles for any prescribed
          finite list of verified critical-line modes, and their
          leading floored responses, while remaining RH-equivalent
          while remaining RH-equivalent; the notch multiplier does
          not amplify the other critical modes relative to its
          square response. Its explicit span and term-count costs
          grow with the notch list, and no finite multiplier can
          remove the complete zeta spectrum. Counting still permits
          cancellation of a finite or sparse off-line set unless the
          multiplier, or a family's common zero set, is zero-free
          there. The resulting arithmetic sign is still open.
          T106 sharpens the additive obstruction for real weights:
          below the tangent-line threshold, attenuating one fixed
          nonreal pole costs quadratic conditioning
          ‖a‖<sub>1</sub>≳(k/H)<sup>2</sup>. Three signed nodes attain
          that order for the pure mode, while the floored response
          still requires complexity outside T104's RH-stable regime.
          This remains a fixed-mode necessity theorem, not an
          eventual sign.
          If RH is false both strict
          signs recur infinitely often; if RH is true the certified
          annular deficit is eventually negative. This is genuine
          subsidiary progress, not QED.
          T66 constructs common-domain zero-adaptive
          theta quasimodes that geometrically isolate residual directions. T67 proves
          compact continuous compressed-graph approximation and compact smooth full
          homogeneous graph approximation by finite tail exponentials, transferring
          the strict T66 defect to a finite matrix. The construction still has
          zero-dependent support, margin, degree, and conditioning; maximal-domain
          graph density and global adaptive inequalities remain open.
          No positive fractional
          rung or one-sided continuum estimate is currently proved.
          A successful argument must use arithmetic beyond
          symmetry, divisor recursion, ordinary inner-function positivity, separate
          modes, individual Hankel factors, boundary traces, entrywise cross-scale
          multipliers, fixed reflected finite raw-mode packets, pure prime-group positivity,
          finite-budget local and exact-reconstruction scalar prime partitions, and
          exact Gaussian smoothing or the audited even finite-order-MGF
          zero-preserving smoothing class, fixed finite PSD modular/radial shift couplings
          in the audited kernel family, and translation-invariant tempered-lag pole compensation.
          The current exact reformulations retain global Jacobi cancellation and the
          complete archimedean/prime explicit formula; infinite-order smoothing,
          infinite non-tempered cancellation inside one block, couplings without positive
          readout, adaptive or continuous layers, and nontranslation-invariant global
          transforms remain unexcluded.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid #38bdf8' }}>
        <strong style={{ color: '#7dd3fc', fontSize: 13 }}>Separate Dyson / collision-flow lane</strong>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: '8px 0 0', lineHeight: 1.65 }}>
          The three records below track internal residuals of the dynamical
          de Bruijn–Newman program. They can sharpen subsidiary flow estimates
          or eliminate proposed mechanisms. Closing them would not, by itself,
          discharge the exact T3 kernel inequality or prove RH.
        </p>
      </div>

      {DYSON_LANE_RESIDUALS.map((r) => (
        <div
          key={r.id}
          className="card"
          style={{ marginBottom: 18, borderLeft: "3px solid " + r.color }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: r.color,
                border: "1px solid " + r.color,
                borderRadius: 4,
                padding: '2px 7px',
              }}
            >
              {r.badge}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 10.5,
                fontWeight: 700,
                color: r.status === 'OPEN' ? '#ef4444' : '#f97316',
                border: "1px solid " + (r.status === 'OPEN' ? '#ef4444' : '#f97316'),
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {r.status}
            </span>
            <code style={{ fontSize: 11, color: '#64748b' }}>{r.tag}</code>
          </div>
          <strong style={{ color: '#e2e8f0', fontSize: 14, display: 'block', marginBottom: 10 }}>
            {r.title}
          </strong>
          {r.body.map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
              {para}
            </p>
          ))}
          {r.links.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {r.links.map((lnk) => (
                <Link
                  key={lnk.to}
                  to={lnk.to}
                  style={{ fontSize: 12, color: r.color, textDecoration: 'none', borderBottom: "1px solid " + r.color }}
                >
                  {lnk.label} →
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="card" style={{ marginTop: 8, borderLeft: '3px solid #64748b' }}>
        <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.65 }}>
          <strong style={{ color: '#cbd5e1' }}>Scope separation:</strong>{' '}
          The Theorem-C Lipschitz basin (C_Lip, requiring only c &le; 0.72) does
          not depend on closing R2. The static-obstruction chain inside R1 is
          rigorous, while the 34-run excursion study remains finite empirical
          evidence. G6a remains a subsidiary open flow estimate. None of these
          statements changes the global verdict: RH is open, and T3 is the sole
          exact global frontier recorded here.
        </div>
      </div>

      <div className="card" style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12.5 }}>
          <Link to="/state-of-program" style={{ color: '#94a3b8' }}>State of the Program</Link>
          <Link to="/route-map" style={{ color: '#94a3b8' }}>Route Map</Link>
          <Link to="/rh-dag" style={{ color: '#94a3b8' }}>Proof DAG</Link>
          <Link to="/spectral-attack" style={{ color: '#94a3b8' }}>Spectral Attack</Link>
        </div>
      </div>
    </div>
  );
}
