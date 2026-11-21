import React from 'react';
import { SnapshotBanner } from '../components/ProgramStatus.jsx';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { ED, STATUS as TK_STATUS } from '../styles/tokens.js';

// Constants referenced by the separate Dyson / collision-flow research lane.
const C_ASYM = 0.9027902227683418;
const C_OBSERVED_MIN = 0.9015828375;
const EXCURSION_CAP = 0.5073;
const THEOREM_A_CAP = 0.25;

const GLOBAL_FRONTIER = {
  id: 'T3',
  tag: 'twin-ladder-exact-residual',
  color: ED.accent,
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
    'T57: the homogeneous feature quotient is ξ(2s−1/2−a)/ξ(2s−1/2+a), unimodular on the unitary Mellin line. The Wigner/Weyl relay is the exact shifted completed-ξ modulus difference; endpoint compression is essential',
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
    'T65: L_N⁽¹⁾=log(ℜ_N/P_N), with Mellin kernel 𝒦(s)=((s−1)ζ(s)−1)/(s(s+1)). It eliminates the PNT pole but no zeta zero; ∃Cσ with L_N⁽¹⁾≥−CσN¹⁺σ eventually exactly when Re ρ≤σ, while exact recurrences rule out eventual monotonicity and log-convexity',
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
  adaptiveCompleteZeroWave:
    'T107: conditional on RH, every nonzero fixed finite square-notched dilation channel P(3/2)=0, after x^(−3/2) normalization, is asymptotic to a complete nonzero mean-zero almost-periodic zeta wave. Even arbitrary k-dependent real mass-one local postfilters with width exponent δ, ℓ¹ exponent τ, and δ+τ<1 differ from the whole unnormalized output by o(k^(3/2)), so both signs still recur infinitely often. This closes cross-mode and growing-height adaptation only for fixed finite square-notched channels—not the positive T101 buffer, critical conditioning, adaptive multiplicative scales, infinite-scale, nonlinear, or global transforms',
  primeJumpAbel:
    'T108: the T101 scalar increment is exactly a nonnegative one-step trapezoid applied to prime/composite jumps. Abel summation rewrites the full buffer as the difference of two floor-aligned geometric-block means of θ(x)−x, exactly adjacent when s divides k, minus a positive compensation whose normalized threshold is ½log(r/s)+O(1/k). The exact mean inequality remains RH-equivalent, while prime jumps force infinitely many curvature reversals and exclude eventual convexity or concavity of log K_u',
  criticalCumulativeBuffer:
    'T109: for any fixed residue lane, the critically damped global cumulative ℒ_d(X)=Σ_{N≤X}F(sN+d)N^(−5/2) is RH-equivalent under the mere requirement that it be bounded below by a fixed constant on a tail. Unconditionally limsup ℒ_d(X)/log X≥B_{r,s}, with B=11081.705… or 40805.171…, while false RH forces unbounded negative excursions. Its exact incidence weights on the signed q-word are nonnegative, and every fixed-order Riesz smoothing retains the same theorem',
  terminalBufferDrawdown:
    'T110: Λᵣ,ₛ(k,u)=Fᵣ,ₛ(k)+Σₕ₌ₖᵘ⁻¹qᵣ,ₛ(h) is the exact terminal buffer after an ordered prefix drawdown. Its prime-jump kernel is the sum of a complete-buffer trapezoid and a prefix trapezoid, both nonnegative, with Λ(k,k)=F(k) and Λ(k,eₖ)=2F(k). The direct RH estimate proves only o(k/log²k) boundary layers. A segmented floating-point scan found no nonpositive F or Λ through k=100,000,000, but T119 rigorously proves that eventual all-u positivity is false despite that finite evidence. This refutes the stronger terminal-buffer conjecture, not RH',
  jointInteriorBuffer:
    'T111: two fixed strictly interior terminal samples recover an exact RH equivalence without using either endpoint. RH is equivalent to eventual positivity of both Λ₂₃,₁₅(15N,21N), Λ₂₃,₁₅(15N,22N), and separately to both Λ₃₂,₂₁(21N,30N), Λ₃₂,₂₁(21N,31N). Rigorous first-1000-zero normalized Hadamard margins are 0.0817561902…, 0.0806566762…, 0.0718293963…, and 0.0566386659…. Distinct interior multipliers have no common zero for Re z>1, although a single channel need not be zero-complete. Each line is unconditionally positive on infinitely many N^(1/2+o(1))-length scale blocks, but no eventual sign is proved. This proves the paired criteria; T119 later disproves the stronger all-u sign',
  singleInteriorBand:
    'T112: one difference of two strictly interior 39/25 terminal samples is already RH-complete. With outer row 24N, RH is equivalent to eventual positivity of Λ₃₉,₂₅(24N,34N)−Λ₃₉,₂₅(24N,25N), or exactly to ∏₉₇₅N≤u<₁₃₂₆N Kᵤ²⁵ ≥ ∏₆₂₅N≤u<₈₅₀N Kᵤ³⁹ eventually. Its nonnegative plateau-trapezoid has mass 3,624,075N² and support ratio 1326/625=2.1216. A rigorous first-10,000-zero Arb/Turing certificate gives normalized margin 0.000726680570605… and restored RH margin 283.859597892608…N³ᐟ². T121 rules out the monotone cross-prime/factor transport shortcut, but the eventual product sign remains open, so RH is not proved',
  singleInteriorRecurrence:
    'T113: the real prime-square pole forces the exact T112 product comparison to hold deeply and unconditionally on infinitely many whole blocks. With BΔ=650(√39−5)(34√34−125)=59279.380606…, limsup ΔN/N³ᐟ²≥BΔ. For every ε∈(0,BΔ), infinitely many blocks of consecutive n, each of length ⌊√N exp(0.8√log N)⌋, satisfy Δn>(BΔ−ε)n³ᐟ² and hence the T112 product inequality with that exponential margin. Exact audits rule out termwise q positivity, pairwise K ordering, same-prime divisibility in either direction, and a nonnegative canonical prime-jump fixed-step kernel. The starting points may have arbitrary gaps, so this proves recurrence—not eventual positivity or RH',
  powerCumulativeBand:
    'T114: for every fixed real α≤5/2, set κ=5/2−α and ℒα(X)=ΣN≤X ΔN/N^α. The exact Mellin transform has its positive square pole at w=κ and every off-line zero pole at w=κ+ρ−1/2. Hence RH is equivalent even to the natural-scale floor ℒα(X)≥−CX^κ on a tail. Unconditionally limsup ℒα(X)/Gκ(X)≥BΔ=59279.380606…, where Gκ=(X^κ−1)/κ and G0=log X. Its q-incidence weights are nonnegative but have both jump signs, its K coefficients remain mixed, and fixed-order Riesz smoothing cancels no pole. No such tail floor is proved',
  movingHeatGap:
    'T115: the positive moving log-Gaussian with T_X=2log X/783 preserves the real prime-square pole and suppresses every nonreal Mellin mode, including hypothetical off-line zeros. Its exact T112 average tends unconditionally to BΔ=59279.380606…. Sharp truncation then proves that every sufficiently large [Y,Y^(29/25)] contains an N with ΔN>(BΔ−ε)N³ᐟ² for every fixed ε>0. This is a rigorous power-gap theorem, not eventual positivity: the window changes with X and supplies only one deep comparator per power interval',
  verifiedHeightHeat:
    'T116: spending the full verified height H=3,000,175,332,800 in the moving heat response gives θH=(2H+1)/(2H−3)=1.0000000000006666277…. For every fixed 0<ε<BΔ, every sufficiently large [Y,Y^θH] contains a whole consecutive √N·exp(0.8√log N) block with Δn>(BΔ−ε)n³ᐟ². The deep-win counting function has lower logarithmic exponent at least 1/(2θH)=0.4999999999996666861…. The contour and threshold are existential and ineffective; the filter suppresses hypothetical off-line modes too, so this is not RH',
  infiniteZeroAdaptiveNotch:
    'T117: enumerate the distinct ordinates γ of zeros actually on Re ρ=1/2 and form Y=Σεπ/(2γ), R(w)=E exp(wY)=∏cosh(πw/(2γ)). The centered product converges, R(iγ)=0, R(0)=1, and R has no off-axis zero. Its fixed positive multiplicative average cancels every leading critical-line mode, preserves BΔ, and preserves every hypothetical off-line pole. RH is therefore equivalent to normalized output →BΔ, eventual positivity, or any natural-scale lower floor. Unconditionally limsup 𝒢Δ/x³ᐟ²≥BΔ; false RH forces liminf 𝒢Δ/x³ᐟ²=−∞. This closes an infinite-filter loophole but imports the complete critical-line spectrum and proves no arithmetic sign',
  terminalBoundaryRectangles:
    'T118: return to the arithmetic 23/15 and 32/21 terminal buffers. Infinitely many consecutive deep row blocks are positive not only at their complete endpoints but throughout two growing ordered-prefix layers on every row. Their width is Lk=⌊√k·exp(0.8476836√log k)/(log k)²⌋. Direct PNT variation still cannot control a proportional-width middle: it costs k^(2−o(1)), above the k³ᐟ² buffer. At μ=113/105, a 256-bit Arb/Turing certificate proves that the first 1,000 critical-mode absolute costs exceed the square bias by more than 9/200. T119 supplies the required phase-sensitive sign reversal and disproves uniform eventual positivity, while leaving RH unresolved',
  explicitPhaseReversal:
    'T119: at (k,u,eₖ)=(105N,113N,160N), a 1,152-bit Arb certificate evaluates an explicit 10,000-zero phase. The low wave is −0.251561551266345…, the square bias is 0.237544635537161…, and the complete residual Hadamard tail is at most 0.004583969610754…, giving an RH-side upper bound below −9/1000. Finite-polynomial almost-periodic recurrence transfers this strict value to infinitely many integer N without any zero-independence hypothesis. If RH is false, the RH-equivalent u=k endpoint is itself negative infinitely often; hence eventual all-u positivity is unconditionally false. Exact valuations also rule out both same-prime divisibility orientations across all 17 aligned middle channels. This refutes a stronger conjecture and does not resolve RH',
  recurrentBracketedIsland:
    'T120: at the exact T119 phase, a shared 1,152-bit Arb/Turing certificate proves W₁>47/1000, W₁₀₆⁄₁₀₅>9/250, and W₁₁₃⁄₁₀₅<−9/1000; T111 gives W₃₀⁄₂₁>1/20 at every phase, while W₃₂⁄₂₁=2W₁ exactly. Joint almost-periodic recurrence therefore gives, on RH, infinitely many rows with signs +,+,−,+,+ at u=(105,106,113,150,160)N. Each has a down-crossing in [106N,113N) and an up-crossing in [113N,150N). This is an RH-conditional route diagnostic, not an RH proof',
  selfSimilarRadixObstruction:
    'T121: the exact T112 product X_N=e^Δ_N has a negative 850N<p≤975N prime sector and a positive 975N<p≤1326N sector. The natural cross-prime quotient and its residual have opposite ±(9,643,725/2)N² leading terms, so the proposed N² transport payment cancels before the N³ᐟ² square layer. The balanced tail obeys J(1/n)=0, J(4/(4n+1))=−7/(4n+1)², and J(2/(2n+1))=7/(2n+1)² in every reciprocal shell; at N=18, threshold Kᵤ≥2¹⁵⁴ has a Hall deficit 155727−155600=127. Equal-or-larger monotone transport is therefore impossible. This is an unconditional route no-go, not a sign theorem or RH proof',
  uniformNegativePhaseInterval:
    'T122: a 1,152-bit, 10,000-zero adaptive Arb/Turing certificate proves three nested continuum bounds around μ₀=113/105: Wμ(t*)<−10⁻⁶ on |μ−μ₀|≤1/64, <−1/1000 on |μ−μ₀|≤1/72, and <−1/200 on |μ−μ₀|≤1/128. Its five exact-rational subdivisions use 649 cell evaluations and 327 certified leaves with zero failures, not a finite-grid inference. On RH, recurrence gives nested negative prefix blocks of k/32+O(1), k/36+O(1), and k/64+O(1) terms. The widest separates bounding sign changes linearly; the deepest forces variation at least (151/1000−o(1))D_N and the strongest negative-area bound. This is conditional route geometry, not a contradiction or an RH proof',
  wholeBlockAggregate:
    'T123 multiplies every ordered prefix in a symmetric interior block into one exact factorial/prime/Kᵥ ballot. Unconditionally its prime-square pole forces limsup log Y_N,δ/N⁵ᐟ²≥𝔅δ>0, so Y_N,δ>1 infinitely often. For δ=1/128, RH and the T122 deep interval also force log Y_N,1/128≤−(21/2560−o(1))ND_N<0 infinitely often; under RH the exact product therefore takes both strict signs around one, with no contradiction. The averaged multiplier has a blind lattice with Re z→log 2/log(32/21)=1.645595…, which blocks only the standard zero-free-multiplier/Landau converse: it neither locates a zeta zero nor proves non-equivalence. At N=128, opposite v₂/v₅ signs and the prime/composite curvature switch rule out direct divisibility and global Jensen routes without determining real order',
  exactMellinRigidity:
    'T124: if finite positive log-scale measures share an open exponential-moment strip and their scalar response Rτ(w)=∫eʷʸdντ(y) is τ-independent on a determining subset, analytic continuation and Fourier uniqueness force ντ to be one fixed measure. Separately, a continuous nonnegative degree-d homogeneous rule on finitely many channels of one conjugate pure mode either annihilates its whole phase orbit or creates a simple real Mellin pole at s=dσ with positive residue. Positive part, absolute value, and square are basic examples. Discrete zero values, variable symbols, full multi-mode waves, adaptive nonlinearities, and global arithmetic transforms remain outside; this is a route classification, not an RH proof or non-equivalence theorem',
  fixedBlockBlindLattice:
    'T125: for a>1 and every fixed density ϖ∈L¹([α,β]) on a positive compact interval, ℬϖ(z)=a^z−2+∫ϖ(μ)μ^z dμ has exactly one simple zero z_n=log 2/log a+2πin/log a+o_ϖ(1) near each sufficiently high base-lattice point. Compact-uniform Riemann–Lebesgue decay and Rouché prove this; bounded variation in the log coordinate restores O_ϖ(1/|n|), while bare L¹ has no universal rate. Exact integer-multiplicity weighted prefix products have normalized atomic empirical measures and the exact response in (493); weak limits recover the continuous symbol locally, but no uniform finite-N vertical decay or inherited Mellin-transfer estimate follows. Atomic, non-Rajchman, scale-adaptive, and fully discrete weights remain outside; no zeta zero is located and RH remains open',
  fixedMeasureBlindPoints:
    'T126: for a>1 and every fixed finite complex Borel measure ν with supp|ν| contained in [α,β] compactly inside (1,a), ℬν(z)=a^z−2+∫μ^z dν(μ) has infinitely many zeros in every half-plane Re z>c with c<σ*=log 2/log a. T125 localizes one zero at every large base-lattice index for L¹ densities; discrete Wiener theory gives an asymptotic lattice subsequence for atomless measures; the general result is nonlocalized. A positive atomic probability measure has positive vertical zero density strictly right of σ*, as δ_{√a} shows on Re z=2σ*. Wasserstein transfer toward one fixed L¹-density target works through heights T_N only when T_NW₁→0; prefix grids permit T_N=o(min{N,M_N}). Endpoint atoms, uncontrolled scale adaptation, and the missing arithmetic Mellin error remain outside; these are multiplier blind points, not zeta zeros, and RH remains open',
  fixedMovingMeasureBlindRectangle:
    'T127: fix K⊂⊂(1,a), a total-variation bound M, and c<σ*=log 2/log a. Weak-* compactness of the measure ball, compact-open continuity of ν↦ℬν, and Rouché’s theorem on a finite subcover give finitely many disks—and hence one common bounded rectangle c<Re z<R, |Im z|<T—meeting the zero set of every symbol. This includes arbitrary row-dependent normalized positive exact weights on K, without weak convergence or regularity in the row. The rectangle need not meet 3/2<Re z<2: δ_{√a} has its nonzero right-half family on Re z=2σ*>2 for a=32/21. The zero may move from row to row, supplies no fixed Mellin factor, and proves neither the weighted O(N²) error, an arithmetic sign, nor RH',
  adaptiveAlgebraicPrefix:
    'T128: set μ₀=(32/21)^(2/3) and u_N=⌊105μ₀N+1/2⌋. The exact strict-interior prefix Λ₃₂,₂₁(105N,u_N) is O(N)-close to one fixed continuous comparator with Q₀(z)=(a^z−a)(a^z+a^(2z/3)−2). Writing y=a^(z/3) gives (y−1)(y²+2y+2), so the zero lines are Re z=0, 1, and 2.4683939547…>2. A direct algebraic 256-bit Arb/Turing fixture proves δ₁₀₀₀>1/20. Hence RH is equivalent to eventual positivity—or nonnegativity—of this one exact rounded prefix. The finite rounded symbols can still have dangerous-strip zeros at enormous heights; the converse uses only the fixed comparator and O(N) endpoint transfer. The eventual product sign is unproved, so RH remains open',
  adaptivePrefixRecurrence:
    'T129: the fixed T128 comparator has prime-square residue B_ad=727454.763559809…>724000. Unconditionally, every sufficiently large [Y,Y^θH], θH=1.0000000000006666277…, contains a whole √N·exp(0.8√log N)-length block with Λ_n>(B_ad−ε)n^(3/2); the deep-index counting exponent is at least 0.4999999999996666861…. The verified-height heat transfer is valid because the O(N) rounding correction is holomorphic for Re v>2 while its contour stays in Re v>7/3. The exact endpoint word has aperiodic 139/140 steps from ∛2688000−139, and the row update is a finite q/K-product recurrence. Exact sign and valuation fixtures defeat monotonicity, letter-sign, and divisibility shortcuts. A nonnegative asymmetric tent rewrites the open problem as one weighted prime-quadrature deficit. The heat filter suppresses hypothetical off-line modes too, so these near-unit power-window wins do not imply additive gaps, eventual positivity, or RH',
  adaptiveNaturalScaleFloor:
    'T130: either one-sided natural-scale bound Λ_N≥−CN^(3/2) or Λ_N≤CN^(3/2) is individually RH-equivalent. The same is true of either eventual local update bound Λ_N₊₁−Λ_N≥−C√N log²(2N) or Λ_N₊₁−Λ_N≤C√N log²(2N). The exact ξ=(32/21)^(1/3) split writes Λ as three nonnegative-kernel root cells with weights 2,2,1, but rigorous root-buffer signs S(4)>2504 and S(84)<−5991 and mixed prime valuations block a cellwise proof. The rounded row is one exact nonnegative integer tent, and its square-completed finite Pascal/lcm comparison is RH-equivalent. At N=3 the exact 2^93 Hall count is 179382<179424, ruling out monotone equal-or-larger K-factor matching. The moving heat suppresses hypothetical high off-line modes and cannot recover the raw floor. These are sharper arithmetic targets and no-gos, not an eventual floor or a proof of RH',
  adaptivePrimePowerCompletedDrift:
    'T131: complete every prime power and set 𝒵_N=log(𝒮_N/𝒜_N). The same exact 139/140 transducer survives with K̃_m=(m+1)^m/[m! lcm(1,…,m)], whose adjacent log jump is m log(1+1/m)−Λ_vM(m). Either one-sided O(√N log²(2N)) bound for Δ𝒵_N is individually RH-equivalent. The translated tent kernel g_N=h_{N+1}−h_N is supported on 2205N<t<5120(N+1), satisfies |g_N|≤685440, and has exact edge signs −64,+21. Its cube-and-higher update is O(N^(1/3)); its square update exceeds 1084000√N eventually for both Beatty letters. Thus the stronger sufficient-only floor Δ𝒵_N≥−10^6√N—or an explicit 2^(1400000⌈√N⌉) finite product comparison—would force RH. The remaining RH-complete object is one signed annular von-Mangoldt quadrature. No required eventual bound is proved',
  adaptiveFiveBandAbel:
    'T132: exact finite summation by parts collapses the broad signed quadrature 𝒬_N^loc to five fixed-width endpoint bands of Eψ(r)=ψ(r)−r. Their widths are 2205, 21s, 3360, 32s, and 5120, with coefficients 64, −32, −74, 21, and 21 for s∈{139,140}. For N≥7 the translated kernel has constant plateaus −141120, p_s∈{−47712,−47040}, q_s∈{200928,201600}, and 107520, with exactly one interior sign crossing. On the pure mode Eψ(x)=x^ρ its leading multiplier factors as (32/105)2205^(ρ+1)(y³−1)(160y³+s y²−210), y=(32/21)^(ρ/3), and has no zero for 0<Re ρ≤1. Thus neither Beatty letter can hide a hypothetical off-line zero at leading order. The five coefficients remain mixed, so nonvanishing supplies no eventual one-sided ballot and RH remains open',
  adaptivePositiveLocalFilterNoGo:
    'T133: every finite nonzero nonnegative average G_N^w=Σ_j w_jg_{N+j} is still pointwise signed. At the first active lower edge it equals −64w_j<0; at the last active upper edge it equals 21w_j>0. An L-row block telescopes exactly to h_{N+L}−h_N and has the same four plateaus with effective letter σ=(u_{N+L}−u_N)/L∈[139,140]. More generally, a normalized nonnegative stencil of width H_N has leading pure-mode multiplier M_{σ_N}, a convex letter average. A uniform root-distance bound keeps this multiplier away from zero throughout 1/2≤Re ρ≤1; if H_N=o(N), every fixed off-line mode therefore survives at its natural N^(Re ρ) order. Positive sublinear local smoothing can change the constant and phase, but cannot unsign the kernel or notch a fixed off-line mode. It proves no arithmetic ballot and RH remains open',
  adaptiveDefectCurvature:
    'T134: write δ_N=s_N−139 and C_N=𝒬_N^loc−𝒬_{N−1}^loc. The rare δ_N=1 rows have exact gaps 24 or 25. On each one, with v=u_N+139, C_N=𝒥(v)+R_N, where 𝒥(v)=21Σ_{32v≤r<32v+32}Eψ(r)−32Σ_{21v≤r<21v+21}Eψ(r) and R_N=O(log N) unconditionally. Consecutive defect v-values have gaps 3337 or 3476, while 𝒥(v+1)−𝒥(v)=O(log v), so a one-sided defect bound extends to every large integer v before any Mellin argument. The primitive 𝔉(X)=21ℋ(32X)−32ℋ(21X) satisfies Δ𝔉=𝒥 and has off-line multiplier 672(32^ρ−21^ρ)/(ρ+1), zero-free for Re ρ>0. Consequently either eventual inequality C_N≥−C√N log²(2N) or C_N≤C√N log²(2N), restricted only to 140 defects, is individually equivalent to RH. Equivalently, either orientation of the completed-row second-difference product is RH-complete. No such bound is proved',
  adaptiveMicrocellComparator:
    'T135: the universal defect cell has the exact reduction 𝒥(v)=672{ψ(32v)−ψ(21v)−11v}+R(v), with |R(v)|≤17136{1+log(32v+31)}. For v≥2 it is one nonnegative trapezoid applied to Λ−1, which does not determine its sign. Writing L_m=lcm(1,…,m), X_v=L_32v(21v)^(21v)(32v−1)!, Y_v=L_21v(32v)^(32v−1)(21v)!, and j_v=⌈√v⌉(1+⌈log₂(2v)⌉)², either eventual comparison 2^(Kj_v)X_v≥Y_v or 2^(Kj_v)Y_v≥X_v is individually RH-equivalent. Opposite 2-adic and intermediate-prime valuations rule out divisibility in either direction, but not real order. Neither comparison is proved',
  adaptiveFixedDepthComposition:
    'T136: chaining any fixed depth d of adjacent 32/21 cells telescopes exactly to the single annulus [21^d v,32^d v]. The product of their T135 ratios is X_d,v/Y_d,v, with logarithm Eψ(32^d v)−Eψ(21^d v)+D_d,v and 0<D_d,v<(d/2)log(32/21). For every fixed d, either binary-buffered orientation remains individually RH-equivalent because 32^(dρ)−21^(dρ) is zero-free for Re ρ>0. Negative 2-adic and positive interval-prime valuations still rule out divisibility both ways. Fixed-depth composition therefore gives no new order theorem; only a genuinely uniform growing-depth argument remains outside this classification',
  adaptiveAdjacentDepthDeconvolution:
    'T137: adjacent-depth subtraction recovers T135 exactly: ℬ_(d+1)(v)−ℬ_d(32v)=A(21^d v) and ℬ_(d+1)(v)−ℬ_d(21v)=A(32^d v). The corresponding cross-products of X_d,v/Y_d,v are identically the original micro-cell ratios, so either buffered orientation is RH-equivalent for every fixed d. Rigorous prime-log enclosures realize all eight sign triples across depths 1–3 by v≤14, ruling out a universal finite-depth sign rule. Any nondecreasing unbounded depth schedule also has infinitely many top-endpoint jumps by a factor >32, making ordinary interpolation supercritical. Only a genuinely nonlocal coupling among overlapping annuli remains outside this no-go',
  adaptiveFiniteOverlapOscillation:
    'T138: every nonzero fixed finite same-scale depth coupling is one finite dilation with exact step kernel W_c(u)=Σ_dc_d·1_(21^d,32^d](u). One primitive is an exact finite combination of Vψ. On RH its x^(−3/2)-normalized value is a nonzero mean-zero uniformly almost-periodic critical-zero wave: the finite exponential multiplier has only O(T) zeros and cannot cancel the TlogT zeta zeros. Hence the primitive is Ω±(x^(3/2)), the coupling takes both signs infinitely often at integer scales, and every exact finite factorial/lcm product orientation crosses one infinitely often on RH. Fixed finite overlap therefore cannot supply an eventual-sign proof; adaptive, infinite-depth, critical-size, or nonhomogeneous coupling remains outside',
  adaptiveSummableInfiniteOverlap:
    'T139: let c_d be a fixed nonzero infinite depth sequence with Σ(d+1)32^d|c_d|<∞. The exact Λ−1 step kernel and first-Riesz primitive still converge absolutely. Writing C(z)=Σc_dz^d, the multiplier is M_c(s)=C(32^s)−C(21^s). Its vertical-translate hull is compact on Re s<1 and contains no identically zero function, because the least active depth has two distinct exponential rates. Jensen therefore gives only O_c(T) multiplier zeros near the critical line, too few to cancel the TlogT zeta zeros. On RH the primitive remains Ω±(x^(3/2)); the weighted cost gives O_c(log x) unit-cell transfer, so the exact integer coupling takes both signs infinitely often. Integer coefficients under this summability are automatically finite. Only scale-dependent, non-summable, critical-size, or nonlinear couplings remain outside',
  adaptiveSubcriticalProfileDrift:
    'T140: row-dependent profiles c^[v] still cannot settle to one sign when their cumulative motion around one fixed nonzero summable profile c is subcritical: Σ_(v≤X)√v(1+log(2v))²||c^[v]−c||_A=o(X^(3/2)), where ||c||_A=Σ_d(d+1)32^d|c_d|. On RH the Chebyshev bound makes the adaptive cumulative differ from the fixed T139 cumulative by o(X^(3/2)); the latter is Ω±(X^(3/2)), so adaptive rows take both signs infinitely often. The same conclusion holds for exact rowwise factorial/lcm products with finite-support integer profiles, including sufficiently sparse edits. A viable adaptive rule must pay critical cumulative profile cost relative to every fixed profile, keep a non-summable tail, or use nonlinear/nonhomogeneous arithmetic information',
  adaptiveExactDualCost:
    'T141: the critical adaptive price is exact. With w_d=(d+1)32^d and q(v)=sup_d|ℬ_d(v)|/w_d, q(v) is the operator norm of the row functional on the weighted profile space. The least profile cost needed to repair a negative row is exactly {−𝒞_c(v)}_+/q(v), attained by placing the correction at a depth maximizing normalized response. On RH, any eventually one-sided adaptive rule must spend limsup X^(−3/2)Σ_(v≤X)q(v)||c^[v]−c||_A>0 against every fixed nonzero profile. The formal cheapest controller simply reads and cancels the target Chebyshev annuli, so it is circular. The remaining task is an independent arithmetic mechanism that supplies correctly directed critical budget, or a nonlinear rule outside this dual problem',
  adaptivePeriodicControllerNoGo:
    'T142: every fixed periodic depth controller remains sign-recurrent on RH. For every nonzero profile c, modulus q, and residue r, bounded-gap quadrature gives Σ_(v≤X,v≡r mod q)𝒞_c(v)=q^(−1)𝓘_c(X)+O_(c,q)(Xlog X)=Ω±(X^(3/2)). Hence 𝒞_c(v) takes both signs infinitely often on each residue class. Assigning arbitrary fixed profiles to the q states cannot help, even if their mean is zero or the states alternate c,−c; choose any active state and apply its residue theorem. Exact periodic factorial/lcm products likewise cross one in both directions. A surviving independent controller needs unbounded or genuinely aperiodic state, increasing period, non-summable profiles, or nonlinear arithmetic input',
  adaptiveLowDiscrepancyNoGo:
    'T143: genuinely aperiodic low-discrepancy state also preserves the critical wave. If a_v selects one fixed nonzero profile with A(X)=Σ_(v≤X)a_v=δX+E(X) and max_(n≤X)|E(n)|=o(√X/log X), discrete Abel summation plus the O(log v) row increment gives Σ_(v≤X)a_v𝒞_c(v)=δS_c(X)+o(X^(3/2))=Ω±(X^(3/2)) on RH. Hence both row signs recur inside the selected state. Applied state by state, this closes every finite-state controller whose active states meet the discrepancy threshold. Irrational mechanical/Sturmian words have bounded discrepancy, so they are included, as are exact product versions. Surviving state must have critical discrepancy, zero density, unboundedly many states, changing or non-summable profiles, or nonlinear arithmetic input',
  adaptiveIndependentRandomNoGo:
    'T144: independent random state also preserves the critical wave almost surely, even though its discrepancy is typically too large for T143. For iid Bernoulli selection, the centered error R_a(X)=Σ_(v≤X)(a_v−δ)𝒞_c(v) has variance O_c(X²log⁴X) on RH. Kolmogorov maximal inequality on dyadic blocks and Borel–Cantelli give R_a(X)=o(X^(3/2)) almost surely, so the selected cumulative is δS_c(X)+o(X^(3/2))=Ω±(X^(3/2)). Statewise application closes every input-independent iid controller with finitely or countably many fixed profiles, including exact products. Independence is essential: selecting by the observed sign of 𝒞_c(v) is precisely T141’s circular feedback. Dependent/nonstationary schedules, zero-density state, changing profiles, non-summable depth, and nonlinear arithmetic input remain open',
  adaptiveMarkovControllerNoGo:
    'T145: every finite time-homogeneous Markov controller is sign-recurrent on each nonzero recurrent class. For an aperiodic irreducible class, exponential covariance decay gives a uniform weighted block-variance bound; a dyadic maximal decomposition and Borel–Cantelli make each centered state sum o(X^(3/2)) on RH. For a period-q class, its q-step skeleton is aperiodic and T142 supplies the density-scaled residue main wave, so Σ_(v≤X,Z_v=j)𝒞_c(v)=π_j𝓘_c(X)+o(X^(3/2))=Ω±(X^(3/2)) almost surely. This includes deterministic cycles, arbitrary starts, transient states, reducible chains on every reached active recurrent class, and exact products. A surviving controller must be time-inhomogeneous or arithmetic-dependent, zero-density or infinite-state, profile-changing, non-summable, or nonlinear',
  adaptiveNonhomogeneousMixingNoGo:
    'T146: time-dependent finite-state mixing still cannot select one sign when every transition preserves one positive law π and all transition products contract mean-zero states uniformly. The product bound ||P_u⋯P_(v−1)f||_(2,π)≤Kr^(v−u)||f|| with r<1 gives exponential covariance decay even though the kernels vary arbitrarily. The T145 dyadic maximal argument then yields Σ_(v≤X,Z_v=j)𝒞_(c^[j])(v)=π_jS_(c^[j])(X)+o(X^(3/2))=Ω±(X^(3/2)) almost surely on RH. Kernels may even be chosen from deterministic arithmetic data: they cannot help while the common marginal law and uniform mixing survive. A finite-state stochastic escape must move its marginal law at critical arithmetic scale or lose uniform mixing; zero-density/infinite state, changing/non-summable profiles, and nonlinear coupling also remain',
  adaptivePredictableMarginalBudget:
    'T147: arbitrary history-dependent stochastic selection reduces to predictable marginal drift plus a subcritical martingale. For p_v=E(a_v|F_(v−1)), Doob maximal inequality and the RH pointwise bound give Σ_(v≤X)(a_v−p_v)𝒞_c(v)=o(X^(3/2)) almost surely, without independence, stationarity, Markov structure, or mixing. Thus selection equals δS_c(X)+Σ(p_v−δ)𝒞_c(v)+o(X^(3/2)). If Σ|p_v−δ||𝒞_c(v)|=o(X^(3/2)), both signs recur; any eventual sign must spend positive critical predictable response budget. This holds statewise for finite/countable history-dependent controllers and exact products. The formal p_v=1_(𝒞_c(v)≥0) escape has zero innovation but reads the target sign, reproducing T141 circularity. The remaining linear stochastic problem is independent arithmetic generation of critical sign-aligned marginal correlation',
  adaptiveSquarefreeStateNoGo:
    'T148: squarefree arithmetic state preserves both critical excursions even though its O(√X) counting discrepancy lies outside T143. Uniform dilation quadrature gives Σ_(m≤X/q)𝒞_c(qm)=q^(−1)𝓘_c(X)+O_c(Xlog X) on RH. Insert μ²(v)=Σ_(k²|v)μ(k), truncate at K=⌊log⁴(2X)⌋, and interchange sums. The K sublattices cost O(KXlog X); the omitted large-square divisors cost O(X^(3/2)log²X/K). Both are o(X^(3/2)), so Σ_(v≤X)μ²(v)𝒞_c(v)=ζ(2)^(−1)𝓘_c(X)+o(X^(3/2))=Ω±(X^(3/2)). The nonsquarefree complement carries coefficient 1−ζ(2)^(−1) and also both signs. Arbitrary fixed profiles and exact products inherit the result. A surviving arithmetic marginal needs critical divisor-tail mass, zero density, or closer correlation with primes inside the annuli',
  adaptiveSummableDivisorStateNoGo:
    'T149: every positive-density divisor-convolution state with a positive power margin preserves both critical excursions. If a(v)=Σ_(q|v)h(q), Σ_q|h(q)|q^(−1+η)<∞ for some 0<η<1, and δ_h=Σ_qh(q)/q lies strictly between 0 and 1, then uniform dilation quadrature and truncation at Q=X^α give Σ_(v≤X)a(v)𝒞_c(v)=δ_h𝓘_c(X)+o(X^(3/2))=Ω±(X^(3/2)) on RH. The complement has coefficient 1−δ_h and also both signs. This includes every r-free selector and finite sieve state, for arbitrary fixed profiles and exact products. A surviving arithmetic state must fail every positive power margin, have zero density, or correlate directly with the annular prime data',
  adaptiveLogMomentDivisorStateNoGo:
    'T150: the T149 positive power margin is not necessary. If Σ_q|h(q)|log²(2q)/q<∞ and 0<δ_h<1, use Q=⌊√X/log²(2X)⌋. The prefix dilation cost is O(Xlog X·H_h(Q))=o(X^(3/2)), while log²(2Q)A_h(Q)→0 makes the divisor tail subcritical. Hence the selected and complementary states carry δ_h and 1−δ_h of the T139 wave and both remain Ω±(X^(3/2)) on RH. This strictly extends T149: excluding r_k=p_(k+⌈klog³(k+1)⌉) gives an infinite positive-density sparse-prime sieve with the log-squared moment finite but every positive power moment divergent. The remaining divisor route requires balanced error at the log^(−2) tail boundary, zero density, or direct prime-annulus correlation',
  adaptiveCriticalSparsePrimeCorrelation:
    'T151: sparse forbidden primes r_(β,k)=p_(k+⌈klog^(β−1)(k+1)⌉) give an exact phase boundary. Their full divisor Euler tail is A_β(Q)≈log^(1−β)Q, so T150 applies exactly for β>3; every finite β still fails all positive power moments. At β=3 the tail is log^(−2)Q and the response is X^(3/2)-critical. With 𝒟_c(q;X)=S_c^(q)(X)−q^(−1)𝓘_c(X), the bounded RH observable 𝔎_c(X)=X^(−3/2)Σ_(q≤X)h_3(q)𝒟_c(q;X) gives selected wave δ_3G_c(log X)+𝔎_c(X)+o(1) and complementary wave (1−δ_3)G_c(log X)−𝔎_c(X)+o(1). If 𝔎_c=o(1), both states retain both signs; any eventual sign requires nonzero phase alignment. This is the first explicit independent critical prime-dilation correlation',
  adaptiveFiniteZeroPacketDecorrelation:
    'T152: the β=3 sieve has natural density δ_3 and Dirichlet series ζ(s)P_3(s), with P_3(s)=∏_(r∈P_3)(1−r^(−s)). Since Σ_r(log r)/r converges, centering cancels the pole at s=1. More directly, A_3(X)−δ_3X=o(X), so Abel summation gives Σ_(v≤X)(a_3(v)−δ_3)v^z=o_z(X^(3/2)) for every fixed Re z=1/2. Every fixed finite packet of critical zeta-zero modes therefore transfers with density δ_3 and contributes nothing to 𝔎_c. Any nonzero T151 response must escape to unbounded zero height through nonuniform resonance between high zeros and the boundary values P_3(1+it). Pole cancellation or bounded-height computation cannot close it; a uniform high-frequency convolution estimate is the live task',
  adaptiveNaturalDensityLargeSieveNoGo:
    'T153: every bounded selector with a natural mean preserves the density-scaled Twin Ladder wave for every fixed finite profile. Truncate the RH explicit formula at height X. Natural density makes each fixed zero mode o(X^(3/2)); for T<|γ|≤2T, color the zeros into O(log T) one-separated families and apply the multiplicative large sieve to b_v=(a_v−δ)√v. Cauchy–Schwarz bounds the normalized block by O_c(log(2T)/√T), uniformly for T≤X. The dyadic high tail vanishes, so Σ_(v≤X)(a_v−δ)𝒞_c(v)=o(X^(3/2)). Every positive-density binary state and its complement retain both signs and exact product crossings. In particular 𝔎_c=o(1), closing the β=3 critical sieve. Any remaining independent selector must have zero density, fail natural density, or use a nonuniform infinite profile',
  adaptiveNaturalDensityInfiniteProfileNoGo:
    'T154: natural density preserves the wave for every fixed uniformly summable infinite profile, not only finite depth. For the depth-d response, truncate the RH explicit formula at T_d=X32^d. The multiplicative large sieve and the explicit-formula remainder give the uniform normalized majorant O(32^(d/2)(d+1)^2). This is summable against c_d whenever ||c||_𝔄=Σ_d(d+1)32^d|c_d|<∞. Since each fixed-depth response is o(X^(3/2)) by T153, dominated convergence yields Σ_(v≤X)(a_v−δ)𝒞_c(v)=o(X^(3/2)) throughout the full T139 space. Positive-density states and complements preserve both signs. Any remaining escape needs zero or absent natural density, nonuniform row-dependent profiles, non-summable depth, or nonlinear coupling',
  adaptiveBanachMeanProfileNoGo:
    'T155: a row-dependent profile schedule with a coordinatewise T139-summable envelope and a natural Cesàro mean c̄ collapses to that fixed mean profile. Center each depth coefficient. T153 makes every fixed-depth centered response o(X^(3/2)), while T154 supplies the summable majorant g_d32^(d/2)(d+1)^2. Dominated convergence gives Σ_(v≤X)𝒞_(c^[v])(v)=𝓘_c̄(X)+o(X^(3/2)). If c̄≠0, the adaptive schedule retains the T139 Ω± wave. More strongly, in any deterministic finite-state schedule whose state densities exist, every positive-density nonzero state retains both signs separately, even when the mean profile cancels. A strict finite-state controller must lose natural state density or use an undominated/nonlinear rule',
  adaptiveNondensityHydrodynamicLimit:
    'T156: every bounded selector, even without natural density, has a complete subsequential X^(3/2)-scale description. The dilation measures μ_X=X^(−1)Σ_(v≤X)a_vδ_(v/X) are weak-* compact, and all zeta phases X^(iγ) can be extracted simultaneously. The multiplicative large sieve makes the high-zero tail uniformly O_c(log T/√T). Along the subsequence, X^(−3/2)Σa_v𝒞_c(v) tends to ℋ_c(μ,ω)=−Σ_ρM_c(ρ)ω_γρ^(−1)∫u^ρdμ. For binary selectors dμ=f(u)du with 0≤f≤1; natural density is the constant f case. Any nondensity one-sided controller must therefore phase-lock a macroscopic multiplicative-scale shape f to the zeta phase ω. Microscopic irregularity alone cannot steer the sign',
  adaptiveLogPeriodicResonance:
    'T157: the canonical T156 phase-locking attempt is a fixed log-periodic weight F(log v). If F has a weighted-absolutely-convergent Fourier series with period L, its RH response is X^(3/2)H_(F,c)(log X)+o(X^(3/2)), where H has shifted frequencies γ+2πk/L. Outside a countable measure-zero set generated by zeta ordinates and their differences, those frequencies are nonzero and distinct. The response is then a nonzero mean-zero almost-periodic wave and is Ω±(X^(3/2)). Only exact zeta-resonant periods can create a constant bias, and that bias must still dominate every off-resonant mode. Discontinuous binary log blocks and exceptional resonance remain open',
  adaptiveBinaryLogBlockResonance:
    'T158: the T157 theorem extends from smooth weights to every periodic bounded-variation weight, including exact binary logarithmic blocks. Replace termwise smooth Euler summation by the periodic exponential resolvent Q_(ρ,F)(t)=∫_0^∞F(t−y)e^(−(ρ+1)y)dy. BV Fourier decay |F̂_k|=O(1/|k|) combines with the shifted zero bound O(log²(2+|λ_k|)/(1+|λ_k|)) to make the full response absolutely convergent. Outside the same countable zeta-resonance set, both a nontrivial binary block and its complement have nonzero mean-zero almost-periodic responses and retain Ω±(X^(3/2)) and both exact row orders. Only exceptional resonance remains for fixed-period binary control',
  adaptiveResonantBlockDesign:
    'T159: an exceptional interval block resonant at L=2πm/γ_j has exact constant bias B_(j,m)=−(4/3)Re(F̂_(−m)M_c(ρ_j)/ρ_j). Optimizing block phase gives |B|_max=(4/3)|sin(πmδ)|/(πm)|M_c(ρ_j)/ρ_j|, so a half-duty first-harmonic block is strongest. A five-depth profile normalized at the first zero and chosen to cancel the second and third multipliers stayed positive in sampled 100- and 300-zero packets, but a 1,000-zero/1.2-million-phase scan found a negative value. The candidate is falsified before infinite-tail control. A viable design must co-optimize the multiplier and resonant block across every growing packet, rigorously dominate the tail, and transfer cumulative positivity to rows',
  adaptiveResonantPairRayleigh:
    'T160: the optimally phased half-duty contribution of the resonant conjugate zero pair is pointwise positive, not merely positive on average. Its exact piecewise exponential resolvent gives h_(ρ,c)(t)>|M_c(ρ)/ρ|·|γ|/(γ²+9/4), sharpened by the factor 149/50 for the certified first zero. All remaining failure is therefore in the other-zero spectrum. Exact collision grouping and Bohr Parseval make finite-depth profile design a positive-semidefinite generalized Rayleigh problem. A depth-nine RMS profile was stable across independently optimized 100-, 300-, and 1,000-zero packets, with sampled minima 0.01698, 0.01655, and 0.01573. This is the first resonant design to survive the T159 1,000-zero stress level, but it is still floating-point finite evidence: interval inputs, uniform phase enclosure, Fourier and infinite-zero tails, growing-packet stability, and cumulative-to-row transfer remain open',
  adaptiveCertifiedResonantEnvelope:
    'T161 upgrades the T160 candidate from finite sampling to a rigorous RH-conditional complete response. At each local block phase, a one-dimensional envelope lets every nonresonant conjugate pair choose its worst possible global phase. The exact half-block derivative gives a cyclic Lipschitz correction, and the residual Hadamard identity charges every zero above the first 10,000. A 256-bit Arb certificate with an independent Turing count and 1,001 phase cells proves min_t H_(F,c†)(t)>0.00092497785698634539 on RH for an exact terminating-decimal depth-nine profile. Thus RH implies an eventual strict cumulative factorial/lcm product order over the selected logarithmic-block rows. This is not RH: the exact aggregate order is not proved unconditionally, its converse is unknown, and no eventual individual-row sign follows',
  adaptiveTwoProfileResonantRobustness:
    'T162 removes the first concrete obstruction to a T161 converse. A Rouché certificate proves that the original exact multiplier M_(c†) has an off-line zero in a radius-10^(−30) disk centered at 0.5622659840+9924.9268719i, above the 10,000-zero Turing height; this is a multiplier zero, not a zeta zero. The exact profiles c±=c†±10^(−4)e₁ remain RH-positive because a complete Hadamard bound charges the depth-one perturbation by less than 0.000214126, leaving min_t H_(F,c±)(t)>0.00071085254508616933. Their multipliers cannot vanish together anywhere in 0<Re s<1, since their difference is 2·10^(−4)(32^s−21^s). The pair removes multiplier blindness, but neither aggregate product order is proved unconditionally and exceptional frequency resonance still blocks an RH converse',
  adaptiveUnconditionalAggregateTransform:
    'T163 derives the resonant aggregate without RH: S_(F,c)(X)=−Σ_ρm_ρM_c(ρ)ρ^(−1)X^(ρ+1)Q_(ρ,F)(log X)+O_(F,c)(Xlog(2X)), with the full zero sum absolutely convergent for every fixed X. The error comes only from discrete transfer and has Mellin transform holomorphic for Re z>1. A half-duty block has exactly the mean and odd Fourier harmonics. Therefore, if both T162 product inequalities were proved and a false-RH right edge were isolated and finite, Pringsheim–Landau forces either a right-edge ordinate at an odd multiple of γ₁ or an exact collision of two right-edge ordinates modulo γ₁. Every other isolated finite off-line configuration is excluded. The arithmetic inequalities, collision residues, exact resonances, and infinite/nonattained right edges remain open',
  adaptiveAsymptoticOddResonance:
    'T164 removes the generic infinite/nonattained-edge escape, conditionally on the same two unproved T162 product orders. Group every shifted collision by the joint residue vector (R_(c+),R_(c−)). Either all classes generated by zeros in a full strip below β*=sup Re ρ cancel simultaneously for both profiles—a joint collision shield—or uncanceled singularities approach Re z=1+β*. Normal convergence away from their divisor and Pringsheim–Landau then force zeros β_n+iγ_n with β_n→β* and dist(γ_n,(2Z+1)γ₁)→0. Thus every remaining false-RH configuration must use exact joint collision shielding or asymptotic odd resonance. Neither exceptional relation is ruled out, and neither arithmetic order is proved, so RH remains open',
  adaptiveTwoPeriodNoGain:
    'T165 proves that a second fixed log period does not close T164 by qualitative lattice separation. For H_a=(2Z+1)a, the distance to H_b is zero for every irrational a/b and for reduced odd/odd rational ratios; it is positive only for an opposite-parity rational ratio. More fundamentally, two separate Pringsheim–Landau arguments may select different zero subsequences approaching the same right edge, so even a positive lattice gap gives no contradiction. The next controller must couple visibility of the same zeros, force a quantitative resonance rate, vary its frequency with scale, or eliminate the joint collision shield directly',
  adaptiveDepthProbeCollisionVisibility:
    'T166 replaces extra periods by the base c^(0)=c† and one exact probe c^(d)=c†+10^(−6)64^(−d)e_d per depth. The T161 margin and complete Hadamard bound prove min H>0.00092494 for every d on RH. If an m-term shifted collision canceled the base and probes through depth 2m−1, their differences would annihilate all moments of a signed measure on at most 2m nodes; Vandermonde uniqueness and irrational log32/log21 force every residue weight to vanish. F. and M. Riesz gives finite-depth visibility for infinite absolutely summable classes too. Thus no fixed class is a universal shield, while any class canceling the first D probes must have more than (D+1)/2 terms. The remaining diagonal escape requires unbounded exact collision multiplicity near a nonattained edge',
  adaptiveGenericGeometricProfile:
    'T167 compresses all depth probes into c(t)=c†+10^(−6)Σ_(d≥1)(t/64)^de_d. The whole path 0≤t≤1 remains RH-positive above 0.00092494, and its multiplier increment is the zero-free critical-strip rational function 64·10^(−6)t(32^s−21^s)/((64−t32^s)(64−t21^s)). For each fixed collision class, the residue difference is a nonzero analytic function of t, so its exceptional parameters are discrete. Since collision classes are countable, almost every single t makes the base and c(t) jointly detect all classes simultaneously. Exact visibility is enough to remove a collision shield; a uniform residue size is not needed. The parameter remains nonconstructive and infinite-depth, and the half-duty controller still permits asymptotic odd resonance',
  adaptiveFiniteSpectrumCriterion:
    'T168 replaces the half-duty block by G_θ(t)=(1+cos(γ₁(t−θ)))/2, whose Fourier support is only {−1,0,1}. A 256-bit Arb certificate with 10,000 completed zeros and the full Hadamard tail proves an RH-conditional base margin above 0.000375507134470647016; five exact depth probes retain 0.000375496012016046695. Three-mode collision classes contain at most three terms, so depths 1,…,5 remove every shield. Bounded Fourier support makes the remaining Landau resonance sequence compact, where the Turing count excludes off-line resonance at 0 and ±γ₁. Therefore RH is equivalent to six eventual weighted aggregate inequalities. None is proved unconditionally, and the controller is tuned to the certified first zeta zero rather than constructed from prime data alone',
  adaptiveThreeDepthCriterion:
    'T169 uses the rigid shifts k=−1,0,1 instead of the generic 2m−1 moment bound. The depth-1,2,3 collision determinant factors into three unit-circle linear roots and a cubic. A 256-bit Schur–Cohn certificate places all cubic roots strictly inside the unit disk, so the determinant cannot vanish when |(32/21)^ρ|>1. Every critical-strip collision is therefore detected by depths 1–3, reducing the T168 ledger from six equivalent inequalities to four. The four weighted arithmetic orders remain unproved and first-zero-tuned',
  adaptiveGenericFiniteProfile:
    'T170 mixes the three T169 depth directions into one finite cube c(u)=c†+10^(−6)Σ_(d=1)^3 64^(−d)u_de_d. A 256-bit interval ledger proves the complete cube stays RH-positive above 0.000375494942026486214. For each collision class, the parameters that cancel its affine residue form a proper null subspace because the T169 depth-residue vector is nonzero. Countably many classes still remove only a null set, so almost every single u detects them all. Compact three-mode resonance is already excluded by the T168 Turing count. Hence, for almost every u, RH is equivalent to one eventual weighted aggregate inequality. The parameter is nonconstructive, the order is unproved, and the controller remains first-zero-tuned',
  adaptiveOneParameterFiniteProfile:
    'T171 restricts the T170 cube to u=(t,t²,t³), 0≤t≤1. For each collision class its residue becomes a nonconstant complex polynomial of degree at most three, because T169 guarantees that one positive-degree coefficient is nonzero. Each class therefore excludes at most three real parameters. The union over countably many classes is countable, so every t outside that set gives the same single-inequality RH equivalence. This sharpens full-measure genericity to a co-countable one-parameter statement, but it still does not identify a rational or algebraic good t, prove the arithmetic order, or remove first-zero tuning',
  adaptiveUniformMultiplierBlindSpot:
    'T172 proves that zero-free-multiplier derandomization cannot work anywhere in the current positive cube. A 384-bit uniform Rouché certificate compares every cube multiplier with the linearization of M_(c†) at its certified off-line blind spot. On the common radius-10^(−6) disk, the base Taylor remainder plus the complete three-coordinate perturbation is below 2.199393376973256903×10^(−7), while the linear boundary magnitude exceeds 1.697632526281556068×10^(−5). Every T170/T171 multiplier therefore has exactly one critical-strip zero in that disk. These are multiplier zeros, not zeta zeros; generic actual-zero avoidance remains valid. An explicit parameter must use genuine zeta noncoincidence, leave this positive component, or prove the arithmetic order directly',
  adaptiveDepth12BranchEscape:
    'T173 leaves the T172 cube along an exact negative depth-12 path. At α=41/200, scaling the rational profile by four gives a complete 10,000-zero, Turing-counted, Hadamard-tail RH-conditional margin 0.000321679025522368361>0.0003 for the same three-mode controller with retuned phase. A separate 512-bit Rouché disk places the tracked T162/T172 multiplier branch at 0.4999855998446+9924.9367162i, wholly left of the critical line. This constructively escapes the known blind branch while preserving the target response. It does not prove the entire depth-12 multiplier zero-free, exclude every shifted collision, prove the aggregate arithmetically, or prove RH',
  adaptiveDepth12LowBlindSpot:
    'T174 performs the missing global-zero-free stress at low height. A separate 512-bit Rouché certificate proves exactly one zero of the same exact depth-12 multiplier in the radius-10^(−12) disk around 0.5608496419737+1.2452344574602i, wholly inside 1/2<Re s<1 and below height 14. The completed first-zero/Turing ledger places the first nontrivial zeta ordinate above 14.1347, so this is a multiplier zero but not a zeta collision. Global multiplier zero-freeness for c♯ is rigorously false; actual zeta-divisor noncoincidence, paired-profile separation, and the arithmetic order remain open',
  adaptiveDilationAlignedNoGain:
    'T175 tests the only obvious endpoint-telescoping controller. The period LΔ=log(32/21) makes GΔ(log(32^d x))=GΔ(log(21^d x)) exactly, but its frequency ωΔ=2π/LΔ=14.9168671662… lies rigorously between the first two zeta ordinates. Turing counts also place 2ωΔ−γ₁ in the same zero-free gap, while M_(c♯)(ρ₁) is nonzero. The shifted first-zero mode is therefore a singleton. On RH the response is nonzero with mean zero and is Ω±, so exact ladder-endpoint alignment cannot produce an eventual one-sided aggregate',
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
    'T42/T176/T177: finite PSD radial layers fail; for 0<a<1/2 the failure survives arbitrary finite derivative enrichment and every bounded PSD coupling of the full integer-modular tower at fixed derivative ceiling',
  lowerEdgeTail:
    'T178: atomless x^(ν−1)g(x) shift mass has normalized tail [2 cosh(s−r)]^(−ν)≻0; a lower-edge atom restores the negative 2×2 minor whenever 0<a<ν/2',
  twoBranchHalfSech:
    'T179: Bₐ=(1−e^(−2a(t+b)))/[2cosh(t−b)] is entrywise positive and fixed-order tail positive, but indefinite on every tail; the exact endpoint and theta corrections are essential',
  endpointOnlyNoGo:
    'T180: restoring the complete endpoint y/S integral still leaves every tail indefinite for 0<a<1/2 when R≡1; the nontrivial theta-R cross-scale factor is essential',
  exactBoundaryRescue:
    'T181: a 384-bit Arb replay proves ∂t∂b A₁⧸₄(0,0)=0.04453353300039674694…>0; the exact theta-R factor reverses the endpoint-only local obstruction',
  exactBoundaryJet:
    'T182: the 512-bit exact order-four boundary jet is positive definite; five confluent derivative levels pass, while order-uniform and interval PSD remain open',
  boundaryEnergyHierarchy:
    'T183: all boundary jets are PSD iff every even/odd P(D)e^(ax)Ψ has at least as much L² energy on x>0 as x<0; along aₙ↓0 this is RH-equivalent',
  infinitesimalBoundaryJet:
    'T184: the 512-bit five-level first-variation jet ∂ₐJₐ|₀ is positive definite; the exact theta rescue persists infinitesimally, while all-degree uniformity remains open',
  infinitesimalHierarchy:
    'T185/T192: all infinitesimal jets are PSD iff the de Branges kernel L₀ is PSD iff RH; seventeen certified levels remain finite evidence, not a strict reduction',
  infinitesimalJetFloor:
    'T186/T192: the normalized jet floor λd is nested; RH iff λd↓0, while non-RH forces a negative finite level. The exact form is now Arb-positive through d=16, but no uniform margin exists',
  translationParityMargin:
    'T187: strict concavity of log Ψ(√s) proves both even and odd translated theta packets stay positive and approach the normalized zero margin from above',
  translationMixtureKernel:
    'T188: the mixed-translation kernel has positive entries, but PSD on every finite grid in any [0,ε] is already equivalent to RH; a false RH would force negative matrices arbitrarily near zero',
  squareConcavityMixtureCounterexample:
    'T189: an Arb-certified three-packet difference-of-Gaussians model proves strict square-radius log-concavity and positive individual packets do not imply translation-mixture PSD',
  twoPacketConcavityTheorem:
    'T190: square-radius log-concavity proves every two-node translation matrix PSD, strictly at distinct theta nodes; three packets are the first size not controlled by concavity',
  localFivePacketProtection:
    'T191: the certified order-four infinitesimal jet protects every theta translation matrix with at most five distinct nodes in one origin neighborhood; an arbitrarily fine negative witness would need at least six packets',
  localSeventeenPacketProtection:
    'T192: a dimension-parametric 512-bit Arb replay certifies the fixed-thickness and infinitesimal jets through degree sixteen; one origin neighborhood protects every matrix through seventeen packets, so a local negative witness needs at least eighteen',
  canonicalTruncationNoGo:
    'T193: near-null theta polynomials follow a deformed cosh/sinh root lattice, but pure-imaginary roots and positive complete translation packets do not sign finite canonical factors; the T189 model has the exact witness ℓf(z+z³/8)=−1/216',
  translationFixedOrderTail:
    'T194: positive diagonal scaling sends the exact translation kernel to sech(t−b) in every fixed whole-tail Cᵐ norm; each fixed packet count is eventually positive, so any three-packet obstruction must touch a bounded left interval',
  translationThreePacketCompactness:
    'T195: strict confluent two-packet positivity plus exponential bounded/far decoupling puts every possible nonpositive three-packet configuration inside one compact translation interval',
  translationTripleCollisionFirstSegment:
    'T196: a 768-bit shared-Taylor Arb cover proves the translated triple-collision jet positive definite for every 0≤T≤2; T>2 and the nonconfluent three-node interior remain open',
  translationTripleCollisionComplete:
    'T197: a 256-bit bivariate Arb boundary-layer bound proves the normalized translated jet within 0.237144302 of its positive limit for every T≥2; with T196, the complete triple-collision face is positive for all T≥0',
  translationThreePacketOriginSlice:
    'T198: a 384-bit boundary-layer cover proves the resolved origin-slice rectangle t₁=0, 49/40≤t₂, t₂+1/2≤t₃≤6 positive, including the exploratory minimum; complementary strips and common translations remain open',
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
    'T93 spends the rigorously isolated first 1,000 zeros individually, shrinking one zero-complete tent to support 529/225=2.351111…. T94 proves every rowwise factorial/multinomial cover still loses at main order. T96 then certifies the first 50,000 zeros and shrinks the support again to 1024/441=2.321995…. T97 identifies the remaining arithmetic target exactly as an adjacent cross-factor carry ballot and rules out its naive monotonicity, divisibility, pairwise, and independent-cover proofs. T98 proves two unconditional subsidiary results for the T93 slack. T99 strengthens recurrence to deep N³ᐟ² checkpoints for both sharp annuli and propagates them into explicit super-√N valid blocks, while T100 derives the exact 32/21 carry ballot and rules out the same local shortcuts at the sharpest support. T101 packages both annuli into an exact all-integer proportional buffer and nonnegative trapezoidal kernel, proves that every fixed residue lane remains RH-complete, and transfers T99 to long consecutive buffer-positive intervals. T102 identifies their shared Beatty word pattern and exactly refutes the global all-k scalar laws. T103 proves every bounded-ℓ¹ local filter through square-root depth remains RH-complete. T104 quantifies the local escape cost; T105 constructs an RH-safe multiplicative escape but proves every finite notch spectrum-incomplete; T106 shows strong real cancellation of one complex local mode has a still higher quadratic conditioning cost; T107 proves subcritical adaptive local postfilters preserve the entire square-notched zero wave. T108 converts the surviving scalar buffer exactly into a compensated difference of floor-aligned geometric θ−x means and rules out convexity shortcuts. T109 builds the maximally damped global positive-kernel cumulative: it has unconditional positive logarithmic limsup, but any tail floor would already prove RH. T110 isolates the ordered terminal-buffer drawdown that survived a numerical scan through k=100,000,000; T119 now proves that its eventual all-u conjecture is false. T111 proves that two strictly interior samples nevertheless form a joint RH equivalence because their multipliers have no common off-line blind spot, with four rigorous positive Hadamard margins. T112 collapses the paired obligation to one strict-interior difference band: a 10,000-zero Arb/Turing budget proves its RH-side margin, its multiplier is zero-free for Re z>1, and its exact support ratio is 1326/625=2.1216. T113 proves that exact product comparison unconditionally on infinitely many whole N^(1/2+o(1))-length blocks with restored prime-square margin 59279.380606…N³ᐟ², while exact local and valuation audits close the naive termwise, divisibility, pairwise, and canonical-prime-jump fixed-step routes. T114 extends the same exact band to every power cumulative α≤5/2: the positive square-pole recurrence persists, but even a −CX^(5/2−α) tail floor is RH-equivalent. T115 uses a moving positive log-Gaussian to extract the prime-square residue unconditionally and proves a deep valid comparator in every power interval [Y,Y^(29/25)], while showing that every fixed finite positive weighting retains mixed arithmetic signs. T116 spends the full Platt–Trudgian verified height to reduce the exact power exponent to 1.0000000000006666277…, upgrades every such window to a whole deep block, and proves a deep-win counting exponent at least 0.4999999999996666861…. T117 classifies the fixed infinite alternative: a positive zero-adaptive notch cancels the complete critical wave and preserves every off-line pole, so even its natural-scale lower floor remains RH-equivalent. T118 returns to the ordered arithmetic buffer: infinitely many deep row blocks carry two growing positive endpoint layers, while a 1,000-zero negative absolute-margin certificate rules out the proposed uniform coefficientwise absolute-amplitude proof across the middle. T119 replaces the provisional independence argument with an explicit 1,152-bit, 10,000-zero phase certificate. On RH it forces normalized Λ₃₂,₂₁(105N,113N) below −9/1000 infinitely often by almost-periodic recurrence; if RH is false, the endpoint equivalence forces negative endpoints infinitely often. Thus eventual all-u positivity is unconditionally false. Exact valuations also close both same-prime divisibility orientations across all 17 aligned middle channels. T120 uses the same exact phase to bracket an RH-conditional negative island between positive channels at 106N and 150N, forcing one down-crossing and one up-crossing on infinitely many common recurrent rows. T121 proves that the T112 comparator’s natural monotone cross-prime transport pays and loses equal N² leading terms, has a sign-changing self-similar tail in every reciprocal shell, and already has a Hall deficit of 127 at N=18. Both are route diagnostics, not proofs or disproofs of RH.',
  structureT122:
    'T122 upgrades the T119 point phase to three rigorously covered real intervals [113/105±1/64], [113/105±1/72], and [113/105±1/128], with progressively stronger negative margins 10⁻⁶, 1/1000, and 1/200. Under RH, recurrence turns them into nested linear blocks of consecutive negative prefixes with a width-versus-depth tradeoff, forced macroscopic variation, and many increments of both signs. This remains an RH-conditional route diagnostic, not a contradiction or a proof or disproof of RH.',
  structureT123:
    'T123 aggregates any fixed symmetric prefix block into an exact finite product. A shifted Mellin/Landau argument forces that product above one infinitely often unconditionally, while RH and the certified 1/128 block force it below one infinitely often. Spectral blind spots prevent the standard converse, and exact arithmetic no-gos prevent simple divisibility or Jensen promotion. The result is conditional sign recurrence plus unconditional positive limsup, not an RH contradiction, proof, disproof, or non-equivalence theorem.',
  structureT124:
    'T124 classifies two formal escape routes. One exact scale-independent scalar response on a determining subset of a common open Mellin strip freezes every positive log-scale measure; finite continuous nonnegative homogeneous rectification of one pure conjugate mode either erases the full orbit or manufactures the real pole with positive residue required by Landau. Discrete zeta-zero matching, variable symbols, full multi-mode or adaptive nonlinear behavior, and genuinely global arithmetic remain unclassified, so this proves neither RH nor non-equivalence.',
  structureT125:
    'T125 proves that every fixed absolutely continuous reweighting of the T123 block retains the asymptotic blind lattice: compact-uniform Riemann–Lebesgue decay and Rouché give one simple zero near each high root of a^z−2. Exact weighted prefix products converge locally to this symbol when their normalized empirical measures converge weakly on the fixed prefix interval, but each finite response is atomic and no uniform high-frequency or Mellin-error transfer is proved. This is a fixed-weight route no-go, not an RH proof or non-equivalence theorem.',
  structureT126:
    'T126 extends right-half zero existence to fixed atomic and singular measures, with a regularity-dependent localization hierarchy: Jessen convexity for the atomic almost-periodic part and a Wiener–Rouché transfer for the atomless part force infinitely many blind points in every half-plane Re z>c with c<σ*=log 2/log a. Positive atomic probabilities even have positive zero density strictly to the right of σ*. A quantitative Wasserstein theorem transfers a growing lattice window only toward one fixed L¹ target when T_NW₁→0. This does not close every atomic or singular Landau route; endpoint support, uncontrolled scale adaptation, and the required discrete Mellin estimate remain outside, so this is still not an RH proof.',
  structureT127:
    'T127 makes that existence theorem uniform over every weak-* compact family with fixed strict-interior support and bounded total variation. Compact-open continuity and a finite Rouché subcover put at least one symbol zero in a common bounded right-half rectangle, even for arbitrary normalized row-dependent positive exact weights with no convergence. The zero can move by row and the rectangle may lie beyond Re z=2, so no fixed multiplier, weighted Mellin transfer, arithmetic sign, or RH conclusion follows.',
  structureT128:
    'T128 tunes one moving endpoint to the algebraic dilation μ₀=(32/21)^(2/3). Nearest-integer rounding changes the exact centered slack by only O(N), leaving a fixed comparator whose multiplier factors explicitly and is zero-free on 3/2<Re z<2. A direct algebraic Arb/Turing calculation supplies an RH-side margin above 1/20, while Landau gives the converse. Thus one exact rounded strict-interior prefix is RH-equivalent; its eventual sign remains unproved, and the rowwise rounded symbols themselves are not claimed zero-free.',
  structureT129:
    'T129 transfers the real prime-square residue and T116 verified-height moving heat to that exact adaptive prefix. Every sufficiently large near-unit power window contains a whole deep positive block, with explicit residue B_ad>724000 and logarithmic counting exponent almost 1/2. The exact ∛2688000 Beatty recurrence and positive asymmetric tent now isolate the arithmetic frontier. The moving heat also asymptotically suppresses hypothetical off-line modes, so it proves recurrence and power-gap coverage—not eventual positivity or RH.',
  structureT130:
    'T130 identifies either one-sided N^(3/2) floor—and either direction of a square-root-times-log-squared local drift bound—as an exact RH-complete bridge. A cubic-root positive-cell split, exact integer tent, and square-completed finite Pascal/lcm form make that bridge fully arithmetic; signed root-buffer fixtures and an exact Hall deficit rule out cellwise sign, divisibility, and monotone matching. The T129 heat still suppresses hypothetical off-line modes and cannot recover this raw floor, so RH remains open.',
  structureT131:
    'T131 completes all prime powers and isolates the zero channel 𝒵_N=log(𝒮_N/𝒜_N). It obeys the same 139/140 recurrence with lcm-completed K̃-factors. Either one-sided √N log²N update bound is RH-equivalent; a uniform >1084000√N square step makes the stronger −10^6√N completed floor sufficient. The exact local kernel has both edge signs, leaving one finite signed von-Mangoldt quadrature rather than a positive tent. No required bound is proved, so RH remains open.',
  structureT132:
    'T132 converts that quadrature exactly into five bounded-width sums of the Chebyshev error at moving endpoints. Its 139- and 140-letter leading multipliers factor explicitly and are zero-free throughout 0<Re ρ≤1, so no individual letter has an off-line leading-mode blind spot. This sharpens the arithmetic target but does not control the mixed-sign five-band ballot; no RH-complete one-sided estimate is proved.',
  structureT133:
    'T133 closes the obvious positive-local-averaging escape. Every finite nonnegative row stencil retains explicit negative and positive edge values, while every normalized stencil of sublinear width has an effective letter σ∈[139,140] and preserves each fixed off-line pure mode at natural order. This is a local-filter no-go, not a bound on the mixed arithmetic ballot or an RH proof.',
  structureT134:
    'T134 isolates the entire off-line obstruction on the rare 140-step defects. Their local-ballot curvature differs by only O(log N) from one universal 32/21 Chebyshev-error micro-cell; bounded defect gaps and an O(log v) unit-step law transfer either one-sided defect estimate to all scales. The resulting first-Riesz multiplier is zero-free off Re ρ=0, making either defect-curvature direction RH-equivalent. The criterion is exact but unproved.',
  structureT135:
    'T135 turns that universal micro-cell into one exact factorial/lcm comparison. The Chebyshev increment carries only an explicit logarithmic remainder, while the full Λ−1 coefficient sequence is a nonnegative trapezoid. A uniformly bounded archimedean deficit converts either one-sided square-root-log-squared bound into either orientation of the integer comparison, each individually RH-equivalent. Opposite prime valuations block divisibility shortcuts, and trapezoid positivity does not sign Λ−1, so no required comparison or RH is proved.',
  structureT136:
    'T136 closes the finite multiplicative-composition escape. Every fixed chain of adjacent micro-cells cancels at all internal endpoints and becomes one wider Chebyshev annulus and one wider factorial/lcm ratio. Its dilation multiplier still loses no off-line zero, while the same opposite valuation signs block divisibility. Thus finite ladder depth neither weakens the RH-complete bound nor supplies its real order; a growing-depth estimate would need new uniform arithmetic control.',
  structureT137:
    'T137 closes adjacent-depth deconvolution, sign persistence, and naive endpoint interpolation. Subtracting two neighboring depths returns one T135 cell exactly, including its integer comparator. All eight depth-1/2/3 sign patterns occur in certified finite fixtures, and every monotone unbounded depth schedule has macroscopic endpoint jumps. A surviving growing-depth strategy must therefore use a new nonlocal relation among overlapping annuli rather than ordinary products, cross-ratios, or sampled signs.',
  structureT138:
    'T138 closes every fixed finite linear overlap as an eventual-sign route. Its exact first-Riesz primitive retains infinitely many critical-zero frequencies, forming a nonzero mean-zero almost-periodic wave on RH; neither the arithmetic depth sum nor its exact factorial/lcm product can settle to one sign. The remaining overlap frontier must change with scale, use infinitely many depths with uniform control, prove a two-sided critical bound, or introduce a genuinely nonhomogeneous global coupling.',
  structureT139:
    'T139 closes the uniformly summable infinite-depth escape. A compact translate-hull argument extends the O(T) multiplier-zero bound from finite exponential polynomials to every fixed sequence with finite Σ(d+1)32^d|c_d|, while that same norm controls integer interpolation. The RH critical wave and both-sign recurrence therefore survive. A genuinely infinite product or overlap must now have growing arithmetic cost, change with scale, seek a two-sided critical bound, or use nonlinear nonhomogeneous structure.',
  structureT140:
    'T140 closes subcritical scale adaptation around every fixed nonzero summable depth profile. The exact RH error estimate converts weighted profile drift into a cumulative perturbation of the T139 wave; below X^(3/2) that perturbation cannot erase its positive and negative excursions. Even sparse rowwise integer product edits obey the no-go when their weighted cost is subcritical. Surviving adaptation must move at critical cumulative size, remain non-summable, or use nonlinear arithmetic data.',
  structureT141:
    'T141 solves the linear adaptive optimization problem itself. Weighted l1/linfinity duality identifies the cheapest depth and exact cost for correcting each row, while T139 recurrence forces every eventual-sign rule to accumulate positive critical X^(3/2) response budget on RH. The optimizer is not a proof mechanism: it explicitly measures and cancels the unknown signed annulus. A viable critical-cost construction must generate the direction independently from arithmetic structure.',
  structureT142:
    'T142 closes fixed periodic arithmetic control, a critical-drift class not covered by T140. Every active residue class is a bounded-gap Riemann sampling of its fixed-profile T139 primitive, so it inherits positive and negative X^(3/2) cumulative excursions and both row signs. Zero-mean, alternating, and arbitrary finite periodic state assignments all fail; an independent controller must have genuinely growing or aperiodic state.',
  structureT143:
    'T143 extends that closure to genuinely aperiodic finite-state control with positive density and discrepancy o(sqrt(X)/log X). Exact Abel summation transfers each active state to its density-scaled T139 cumulative with only subcritical error. Balanced mechanical, Sturmian, and other low-discrepancy selectors therefore retain both signs, even for exact products. Any remaining state mechanism must have critical discrepancy, zero-density or unbounded state, changing/non-summable profiles, or nonlinear arithmetic input.',
  structureT144:
    'T144 closes input-independent iid random control beyond the T143 discrepancy range. The centered selected sum is a martingale whose RH variance is O(X²log⁴X); Kolmogorov maximal inequality and Borel–Cantelli make it o(X^(3/2)) almost surely. Every active nonzero state in a finite or countable fixed-profile law therefore retains both signs, including exact products. Randomness can help only by becoming arithmetic-dependent feedback, dependent/nonstationary, zero-density, profile-changing, non-summable, or nonlinear.',
  structureT145:
    'T145 closes every finite homogeneous Markov scheduler, including dependence and periodicity. Exponential covariance decay plus a dyadic maximal inequality controls aperiodic classes; periodic classes reduce through their skeletons to T142 residue waves. Every reached recurrent state with a fixed nonzero profile retains both signs almost surely. Only time-inhomogeneous or arithmetic-dependent transitions, zero-density/infinite state, changing or non-summable profiles, and nonlinear coupling remain.',
  structureT146:
    'T146 closes uniformly mixing time-inhomogeneous finite-state control with a common positive law. Uniform contraction of every transition product preserves exponential covariance decay, so the centered state error remains o(X^(3/2)) almost surely and the density-scaled T139 wave survives. Even deterministic arithmetic choice among such kernels fails. A stochastic escape must move its marginal law at critical scale or destroy uniform mixing.',
  structureT147:
    'T147 identifies the exact currency of every stochastic escape. After conditioning on the past, the innovation is always an o(X^(3/2)) martingale on RH; only the predictable marginal drift remains. Subcritical weighted drift preserves both signs, while eventual one-sidedness requires positive critical response budget. The sign-reading optimizer attains that budget circularly. A useful route must now manufacture the same critical correlation from independent arithmetic structure.',
  structureT148:
    'T148 tests a genuine independent arithmetic marginal at the critical discrepancy scale. Möbius square-divisor expansion plus uniform dilation quadrature shows that squarefree rows carry exactly 1/ζ(2) of the T139 wave and nonsquarefree rows the complement, up to o(X^(3/2)). Both states retain both signs and exact product crossings. Index factorization alone therefore does not manufacture the T147 critical correlation.',
  structureT149:
    'T149 lifts the squarefree calculation to every divisor-convolution indicator whose coefficients have any positive power of summability beyond the harmonic boundary. A power-scale truncation leaves the density times the T139 wave and only subcritical tails, so both the state and its complement remain sign-recurrent on RH. The remaining divisor frontier is genuinely borderline, zero-density, or prime-correlated.',
  structureT150:
    'T150 crosses the positive-power boundary itself. A log-squared harmonic coefficient moment is enough for a balanced square-root truncation, and an explicit infinite sparse-prime sieve shows this class is strictly larger than T149. Even that genuinely borderline multiplicative state preserves both critical excursions; only the balanced log-tail threshold, zero density, or direct prime correlation remains.',
  structureT151:
    'T151 identifies the first unresolved divisor controller rather than another diffuse class. The sparse-prime family has a sharp beta=3 transition, where its Euler tail is exactly log^(−2)Q. Exact interchange compresses the entire escape into one bounded signed dilation-error observable. Subcritical correlation closes the controller; eventual sign requires critical phase alignment with the T139 wave.',
  structureT152:
    'T152 rules out every low-frequency source of the T151 alignment. The critical sieve has density, its centered Dirichlet series loses the pole at one, and every fixed critical-line monomial—and therefore every finite zero packet—decorrelates at X^(3/2) scale. Any surviving response must be a genuinely nonuniform high-zero/boundary-frequency resonance.',
  structureT153:
    'T153 closes the high-frequency gap with the multiplicative large sieve. Local zero counts split each dyadic packet into separated families; their total normalized contribution decays like log T/sqrt(T). Natural density handles the fixed low packet. Thus every natural-density state samples the same critical wave, including the formerly critical beta=3 sieve.',
  structureT154:
    'T154 makes the large-sieve closure uniform across the complete T139 profile space. A depth-dependent cutoff gives a 32^(d/2)(d+1)^2 majorant, and the stronger T139 norm makes that majorant summable. Dominated convergence therefore transfers every natural-density state through infinite ladder depth.',
  structureT155:
    'T155 closes dominated row-dependent schedules with a stable profile mean. Depthwise centering plus the T154 majorant leaves exactly the fixed mean-profile wave. Statewise application also closes every deterministic finite-state schedule with natural state densities, even when its mean profile is zero.',
  structureT156:
    'T156 gives the compact limit space for every remaining nondensity selector. High zeros vanish uniformly, leaving only a macroscopic dilation-density profile coupled to the simultaneous zeta phase. The open controller is therefore a log-scale phase-locking problem, not arbitrary microscopic noise.',
  structureT157:
    'T157 solves the smooth fixed-period version of that phase-locking problem generically. Log-periodic Fourier modes shift each zeta frequency by 2πk/L; all but a countable set of periods leave a nonzero mean-zero wave. The exceptional periods are now explicit spectral resonance targets.',
  structureT158:
    'T158 removes the smoothness loophole. A periodic exponential resolvent handles exact binary block jumps, and BV Fourier decay still makes the response summable. Both the block and its complement remain sign-recurrent for every nonresonant period.',
  structureT159:
    'T159 enters the exceptional set constructively. It derives the sharp interval-block resonant bias, tests a five-depth first-zero filter, and finds that its encouraging 100/300-zero margins break in the 1,000-zero packet. Resonance is real, but the first co-design does not dominate.',
  structureT160:
    'T160 stops charging the resonant pair against itself. The exact half-block resolvent makes that full conjugate-pair response pointwise positive; only the other zeros need suppression. Their finite-depth Bohr energy is a generalized eigenproblem, and its first depth-nine profile survives the current 1,000-zero finite scan with a visible margin. Rigorous tail and row transfer are still missing.',
  structureT161:
    'T161 certifies the complete exceptional response conditional on RH. A worst-phase envelope dominates all nonresonant zero pairs, a Lipschitz grid covers every local phase, and a residual Hadamard budget covers the infinite tail. The resulting positive cumulative product is now a rigorous RH consequence; proving it directly or proving its converse is the remaining arithmetic gap.',
  structureT162:
    'T162 makes the exceptional controller jointly zero-detecting at the multiplier level. Two tiny exact depth-one perturbations preserve a certified complete positive response and have no common multiplier zero in the critical strip. A Rouché disk proves why the pair is necessary. Frequency resonance and the unconditional aggregate signs remain open.',
  structureT163:
    'T163 supplies the unconditional transform needed for a converse. The half-duty spectrum contains only the mean and odd harmonics, so Landau reduces every isolated finite false-RH edge to an exact odd resonance or an exact ordinate collision modulo the first-zero frequency. Infinite right edges remain the analytic escape.',
  structureT164:
    'T164 classifies that infinite-edge escape. Under the two still-unproved aggregate orders, every false-RH edge is protected either by simultaneous two-profile cancellation throughout a full top strip or by zero ordinates approaching the odd first-zero harmonic lattice as their real parts approach the supremum. These exceptional arithmetic-frequency relations remain open.',
  structureT165:
    'T165 closes the naive second-period follow-up. Incommensurate odd harmonic lattices are asymptotically incident, while the rare positive-gap rational case still permits different Landau witness subsequences. Fixed-period duplication is therefore not a converse; the next step needs same-zero coupling, quantitative approximation, chirping, or direct collision algebra.',
  structureT166:
    'T166 makes depth variation useful. A countable uniformly RH-positive probe family detects every fixed shifted collision class, with an explicit 2m−1 depth bound for m terms. Only a diagonal shield of unbounded exact collision multiplicity can survive toward a nonattained edge; its arithmetic orders and exclusion remain open.',
  structureT167:
    'T167 compresses countably many depth directions into one generic geometric profile. Almost every parameter pairs with the T161 base to detect every collision class simultaneously; this removes exact shielding, though the parameter remains nonconstructive and infinite-depth and odd resonance survives.',
  structureT168:
    'T168 makes both sides finite. A three-mode nonnegative controller and the base plus five rational depth probes remove collision shielding and unbounded harmonic escape, proving a six-inequality RH equivalence. The six orders are still open, and the controller explicitly reads the certified first zero.',
  structureT169:
    'T169 uses the exact three-shift determinant to remove two redundant probes. Schur–Cohn stability proves depths one through three already separate every collision, leaving a four-inequality RH criterion. This sharpens the finite ledger, not RH itself.',
  structureT170:
    'T170 mixes those three separating directions into one finite profile. Every collision excludes only a proper affine null slice of parameter space, so almost every cube point sees all classes at once and gives a one-inequality RH criterion. No explicit good parameter or arithmetic proof is supplied.',
  structureT171:
    'T171 restricts the cube to one cubic path. Each collision excludes at most three scalar parameters, so only a countable exceptional set remains. Effective selection of a rational or algebraic good parameter is still open.',
  structureT172:
    'T172 closes one proposed selection shortcut. Every multiplier in the whole positive cube retains the same off-line blind spot by a uniform Rouché disk, so no parameter there can be certified by global multiplier zero-freeness. The certified roots are not zeta zeros.',
  structureT173:
    'T173 escapes the small-cube obstruction. An exact depth-12 profile keeps a certified response above the public threshold while the known blind branch crosses left of the critical line.',
  structureT174:
    'T174 closes the hoped-for global zero-free follow-up: the same multiplier has a rigorously isolated low critical-strip zero. It lies below the first nontrivial zeta zero, so it is not an actual zeta collision; explicit noncoincidence or paired separation is now the analytic gate.',
  structureT175:
    'T175 closes the natural arithmetic telescoping shortcut. Matching the controller period to log(32/21) aligns every ladder endpoint but removes all zero-frequency zeta resonance; a certified singleton mode forces both aggregate signs even on RH. Any surviving arithmetic proof must use genuinely nonlocal prime correlation.',
  structureT176:
    'T176 returns to the sole coupled-kernel frontier and closes the remaining fixed finite derivative-layer shortcut below half thickness. Tail asymptotics isolate the least active shift and highest active derivative; the normalized 2×2 determinant stays strictly negative. Any surviving Gram construction must use infinite, continuous, test-adaptive, or genuinely nonlocal cross-fiber mixing.',
  structureT177:
    'T177 shows that merely making the modular layer set infinite is still insufficient. Any bounded PSD operator on the full integer tower has an isolated least active layer, while every later theta feature is superexponentially small in ℓ². The exact continuum rescue therefore requires lower-edge accumulation or another unbounded/nonlocal mechanism.',
  structureT178:
    'T178 classifies that lower-edge mechanism. Atomless power-law mass produces a strict fractional half-sech Gram limit, while any atom at the lower edge restores the discrete negative minor below the dimension threshold a=ν/2. Continuity helps locally in the tail but still supplies no global PSD theorem.',
  structureT179:
    'T179 closes the canonical two-branch promotion of that limit. Its boundary 2×2 minor is strictly negative, and real-analytic Gram continuation rules out PSD on every tail even though every fixed order eventually becomes positive. The exact endpoint, theta, and cross-scale corrections are therefore essential.',
  structureT180:
    'T180 keeps the exact endpoint integral and closes that refinement too. A pointwise incomplete-gamma monotonicity makes the boundary mixed curvature negative throughout 0<a<1/2, so only the nontrivial theta-R factor and its cross-scale products remain as the exact continuum mechanism.',
  structureT181:
    'T181 certifies that the surviving theta factor really flips the first boundary sign at a=1/4. Nearby exact 2×2 minors are positive, unlike the R≡1 model; this is a local necessary-condition rescue, not higher-order or global PSD.',
  structureT182:
    'T182 proves that the rescue is not just a curvature accident. The full five-level confluent boundary jet is positive definite at a=1/4, moving the exact frontier from low fixed order to uniform control across all derivative orders or a whole interval.',
  structureT183:
    'T183 turns that uniformity gap into an explicit one-sided derivative-energy hierarchy. Taylor convergence, analytic Gram continuation, and Wiener-Hopf rigidity make the all-degree hierarchy equivalent to fixed-thickness Twin Ladder positivity.',
  structureT184:
    'T184 moves the finite certificate into the required a→0 regime. The full five-level first-variation jet is positive definite, so the local rescue survives infinitesimally; proving it at every degree and uniformly for small positive thickness is now the precise gap.',
  structureT185:
    'T185 classifies the all-degree infinitesimal target. Fourier transformation identifies its polynomial forms with the infinitesimal de Branges kernel L₀; weighted polynomial density recovers all kernel evaluations, so positivity at every degree is exactly equivalent to RH rather than a strict intermediate theorem.',
  structureT186:
    'T186 supplies the correct scale and closes the coercive shortcut. A translated theta packet has fixed derivative energy but infinitesimal form equal to a vanishing positive theta tail, so the least normalized jet eigenvalue must tend to zero under RH; any off-line zero instead appears as a negative finite-degree witness.',
  structureT187:
    'T187 proves that the canonical translated near-null family is safe in each parity. Strict square-radius log-concavity bounds its cross-overlap by its radial tail exactly; any negative jet witness must therefore use a genuinely non-translation derivative superposition.',
  structureT188:
    'T188 locates that interference obstruction exactly. Finite differences turn every polynomial jet into a mixture of arbitrarily small translations, so local matrix PSD would prove RH. Positive entries and positive exploratory grids are not a Gram factorization, and their collapsing eigenvalue floor blocks a fixed first-mode perturbation argument.',
  structureT189:
    'T189 closes the concavity-only promotion. The positive model e^(−x²)−½e^(−2x²) satisfies the exact T187 strict concavity hypothesis, but its positive-entry three-translation matrix has a certified negative determinant. The theta kernel therefore needs genuinely zeta-specific interference control.',
  structureT190:
    'T190 extracts the sharp theorem left by that counterexample. A square-radius reparameterization turns the mixed packet into an overlap dominated by the two diagonal tails; Cauchy–Schwarz proves every two-packet principal theta matrix positive definite. Three packets are the first unrestricted size not settled by concavity.',
  structureT191:
    'T191 reconnects translation mixtures to the theta-specific certified jet. Mixed divided differences converge uniformly to the positive T184 order-four matrix across every five-node collision pattern, so one origin neighborhood protects all mixtures through five packets. The unrestricted three-packet problem remains open, but an arbitrarily fine negative witness must begin at six.',
  structureT192:
    'T192 pushes that finite protection to the prior exploratory endpoint. The 512-bit degree-sixteen replay certifies all seventeen leading determinants of both the exact a=1/4 boundary jet and its a=0 first variation. Mixed divided differences now protect seventeen-packet origin clusters; any arbitrarily fine negative matrix must begin at eighteen packets.',
  structureT193:
    'T193 audits the near-null eigenpolynomials instead of extending the finite degree again. Their roots closely follow the cosh/sinh canonical lattices, but a 99.8% energy overlap still misses the degree-24 minimum by a factor near 63. In the strict-concavity T189 model, the first sine factor z(1+z²/8) has only imaginary roots yet exact form −1/216. Finite root deformations therefore need a new theta-specific sign theorem.',
  structureT194:
    'T194 closes the large-translation part at every fixed matrix order. Exact endpoint scaling gives K̃tr(t,b)=sech(t−b)+E with every fixed derivative family of E uniformly small on the whole tail. The exact sech determinant and the T48 divided-difference compactification handle collisions and unbounded gaps. Any three-packet obstruction must now touch a bounded left interval, but the tail threshold depends on packet count, so all-order PSD and RH remain open.',
  structureT195:
    'T195 closes the remaining escape regimes specifically for three packets. T187 strict concavity gives a positive two-node confluent determinant at every finite translation, while normalized correlations and derivatives between bounded and escaping nodes decay polynomially times e^(−b). Every escaping triple splits into positive blocks, so the unresolved sign is one compact interval problem.',
  structureT196:
    'T196 certifies the first two translation units of the triple-collision boundary. A 4,096-box, order-fourteen Arb cover retains one common translation variable through the jet, fixed endpoint gauge, and determinant. The origin box is directly positive, the exact determinant derivative is negative on every later box, and the normalized T=2 determinant is 0.939231127963760833±2.35×10⁻¹⁹. Thus the confluent 3×3 jet is positive definite on [0,2]; joining it to an explicit tail and certifying the nonconfluent interior remain open.',
  structureT197:
    'T197 supplies the tail join. The exact normalized kernel splits into an explicit algebraic-sech factor and one boundary-layer correction. A degree-(2,2) bivariate Arb jet covers [2,4] in 128 exact boxes and all T≥4 in one compact parameter rectangle. The algebraic and correction Frobenius errors sum to 0.237144301660067167, strictly below (9−√17)/16. Hence T196–T197 prove the translated triple-collision jet positive for every T≥0. The nonconfluent compact three-node interior remains open.',
  structureT198:
    'T198 enters that nonconfluent interior on the origin slice. A nonsingular positive endpoint scale keeps the exact boundary-layer kernel order one at t₁=0. Twelve-mode, 384-bit integration and exact 1/40-node boxes certify t₂≥49/40, t₃−t₂≥1/2, and t₃≤6 with determinant lower endpoint 0.000556506552749633686. This contains the exploratory minimum near (0,1.35625,2.1125); the complementary collision strips, long origin-slice tail, and common translations remain open.',
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
    'square-scale averaging preserves but does not attenuate the poles, and its exact Jacobi heat trace is positive only before the essential main term is subtracted; its causal smoother has no bounded or tempered inverse, exact prime-power renewal is lower order, fixed-Cᵐ half-sech asymptotics have no all-order spectral gap, every finite signed upper half-sech relative bound fails, every tight positive adaptive majorant remains at the centered T47 scale, the natural sinh-to-linear multiplier for the finite-height Schur window has a negative real 2×2 minor, strip-Schur positivity can still leave the original endpoint kernel indefinite, fixed bands lose high residual poles, and one zero-adaptive common-domain family yields finite exponential witnesses only with zero-dependent support and approximation complexity; the first-radix Mellin kernel retains every zeta-zero pole, its exact sequence has no eventual monotonicity or log-convexity, its squarefree carry-row factors have no coordinatewise sign, and uniform local or primewise block estimates do not repair that sign. ' +
    'The exact repeated-prime ballot is the already-accounted higher-radix correction, while its algebraically disjoint high-prime first-layer complement remains zero-strip complete. Signed mass-zero Haar smoothing loses absolute zero-sum convergence, and reconstructing its additive level restores the attenuated half-power; no converse drift theorem is known. ' +
    'The fixed-filter prime-square variance persists for arbitrary signed weights, but its natural-density limit does not restrict the sparse nonuniform adaptive starts. A fixed multiplicative dilation escapes that local obstruction only by becoming macroscopic; its surviving prime kernel is again an RH-equivalent weighted-PNT remainder. Translation-invariant tempered-lag compensation cannot ' +
    'carry a nonzero pole share, and an unrestricted Hilbert factorization ' +
    'is only an RH-equivalent repackaging. Infinite-order smoothing, infinite non-tempered ' +
    'cancellation inside one block, couplings without positive readout, uniform infinite/continuous ' +
    'fiber mixing, and non-majorant nontranslation-invariant global transforms remain unexcluded. T3 and RH remain open.',
};

const SEAM_CHAIN_STATUS = {
  status: '(1) CLOSED · (2) OPEN · (3) REDUCED, NO BOUND CHANGE',
  title: 'Seam-chain / signed-certificate program (imp-95210..95420)',
  body: [
    'This is a separate program from T3, tracking whether a signed (as opposed to ' +
    'absolute-value) per-window certificate can transcribe the Lambda <= 0.14 completion ' +
    'contract data. It reduces to three obligations, most recently restated by ' +
    'imp-95255 and imp-95276.',
    '(1) Per-window Q extraction: UNCHANGED. y_min rides the same isolation-group Q ' +
    'that already carries x_min (x_min <= y_min <= 2 x_min exact, imp-95222; measured ' +
    'y_min/x_min ratios decrease toward 1 on the ported grids). This leg maps cleanly.',
    '(2) Signed weight / modulus-phase certificate: BLOCKED. The depth argument (y_min) ' +
    'is portable, but its phase content theta is a scale-invariant per-window sign ' +
    'functional with no image under the current geometry+modulus transcription -- it is ' +
    'trivially 1 on the fixed-amplitude family the paper specifies (imp-95255). The block ' +
    'is at the transcription, not the certificate.',
    '(3) Envelope-shape / gammaSL seam-to-chain-gate map, including the imp-95212 ' +
    'Fresnel-Airy envelope port: REDUCED. The gate-side pipeline (gFromLam -> gammaSL) ' +
    'is closed by identity and monotonicity, so this obligation now reduces entirely to ' +
    'obligations (1) and the still-open imp-95212 port -- it is not an independent map ' +
    'to build (imp-95276).',
    'Net: obligation (1) closed, obligation (2) open at the transcription layer, ' +
    'obligation (3) reduced to (1) + the imp-95212 port. Nothing here derives or moves a ' +
    'bound; no refereed bound is changed.',
  ],
};

const LATEST_TWIN_LADDER_CHECKPOINT = [
  {
    id: 'T47',
    color: ED.series1,
    status: 'EXACT CRITERION · BOUND OPEN',
    title: 'The staged strip is one triangular prime inequality',
    formula: 'Σp≤x (x−p)log p ≤ (x²−1)/2 + Cx¹⁵ᐟ⁸',
    detail:
      'This is equivalent to the causal lower bound at x¹ᐟ⁸ and to the closed zero strip [1/8, 7/8]. ' +
      'The first Riesz factor makes the zero sum absolute, so no logarithmic loss is needed. The inequality itself is unproved.',
  },
  {
    id: 'T48',
    color: ED.series3,
    status: 'PROVED FIXED-ORDER TAIL THEOREM',
    title: 'Continuum principal minors survive clustering and separation',
    formula: '∀n ∃Lₐ,ₙ: [𝒜ₐ(tᵢ,tⱼ)] ≻ 0 for distinct tᵢ ≥ Lₐ,ₙ',
    detail:
      'The normalized block converges in fixed Cᵐ norms to the half-sech kernel. The threshold depends on n, ' +
      'and far-separated ordered cross minors are negative, so this proves neither one global tail PSD statement nor total positivity.',
  },
  {
    id: 'T49',
    color: ED.brass,
    status: 'PROVED RELAY · INPUT OPEN',
    title: 'Möbius deaveraging has an exact fixed-power price',
    formula: 'M(x)=O(x⁷ᐟ⁸logᴷx) ⇒ ℛ₁,₁⁄₄(x)=O(x¹ᐟ⁸logᴷx)',
    detail:
      'Abel summation makes the signed bottleneck explicit. This Mertens estimate would prove the staged strip, ' +
      'but it is stronger at boundary multiplicities and is not currently known.',
  },
  {
    id: 'T50',
    color: ED.series5,
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
    color: ED.accent,
    status: 'EXACT JACOBI BRIDGE · CENTERED SIGN OPEN',
    title: 'The sparse target is a positive Twin Ladder heat trace',
    formula: 'ℋ(u)=Σm,p(log p)e⁻πm²pu ≤ ζ(2)/(πu) + Cu⁻⁷ᐟ⁸',
    detail:
      'The displayed bound is equivalent to the staged strip, and its associated differentiated carrier Jₚ is an exact positive translate mixture of Ψ. ' +
      'Its u⁻¹ main term consumes the positivity; complete monotonicity and modular splitting do not control the centered remainder.',
  },
  {
    id: 'T53',
    color: ED.accent,
    status: 'EXACT SYMBOL · GENERIC CONVERSE REFUTED',
    title: 'Jacobi smoothing is pole-faithful but exponentially unstable',
    formula: '|ĥ(τ)| ≍ (1+|τ|)¹³ᐟ⁸e⁻π|τ|ᐟ²',
    detail:
      'The symbol never vanishes, so no forbidden zeta pole is canceled, but no finite-measure or tempered inverse exists. ' +
      'A smooth positive PNT density satisfies the averaged bound while its pointwise triangular error is unbounded.',
  },
  {
    id: 'T54',
    color: ED.brass,
    status: 'EXACT RENEWAL · LOWER ORDER',
    title: 'Prime extraction contributes only a bounded cusp correction',
    formula: 'ℋₚᶜ = ℋΛᶜ − ζ(3/2)Q∞ + Γ(3/4)π¹ᐟ⁴t¹ᐟ⁴log(1/t) + O(t¹ᐟ⁴)',
    detail:
      'The k=2 Möbius/Jacobi term collapses to an explicit positive trace, and every k≥3 term is constant plus O(t¹ᐟ⁴). ' +
      'Renewal cannot touch the open t⁻¹ᐟ⁸ frontier.',
  },
  {
    id: 'T55',
    color: ED.series3,
    status: 'TAIL RIGIDITY · GENERIC PROMOTION REFUTED',
    title: 'Eventual PSD is already the global fixed-thickness condition',
    formula: 'Kₐ|[L,∞) ⪰ 0 for some L  ⇔  𝒜ₐ ⪰ 0 globally',
    detail:
      'The half-sech multiplier has spectral infimum zero, and an analytic counterkernel is indefinite on every tail despite fixed-order positivity. ' +
      'For the exact kernel, real analyticity propagates tail PSD globally; along aₙ→0, infinitely many such claims are RH-equivalent.',
  },
  {
    id: 'T56',
    color: ED.accent,
    status: 'SIGNED ROUTE COUNTEREXAMPLE · PSD STILL OPEN',
    title: 'Even every finite upper half-sech relative bound fails',
    formula: 'sup ⟨f,(Kₐ−H)f⟩ / ⟨f,Hf⟩ = +∞ on every tail',
    detail:
      'Exact theta features, oscillatory radial tests, and T67 graph approximation preserve a positive finite-evaluation sign. ' +
      'This refutes the signed upper comparison and therefore the absolute one, but the witness points toward Kₐ ⪰ 0 and proves neither PSD nor RH.',
  },
  {
    id: 'T57',
    color: ED.series5,
    status: 'EXACT PHASE-SPACE RELAY · NOT NARROWER',
    title: 'Center frequency returns to the completed-ξ modulus',
    formula: '∫e²ᵛᵀΣₐ(T,ω)dT = (|X(v+a+iω)|²−|X(v−a+iω)|²)/v',
    detail:
      'The homogeneous feature quotient is the unimodular completed-ξ phase, while the finite endpoint compression is essential. ' +
      'Signed divisor shells and Gaussian smoothing do not supply a smaller positivity theorem.',
  },
  {
    id: 'T58',
    color: ED.series1,
    status: 'RIGOROUS FINITE TRANSFER · NO STRIP',
    title: 'Verified zero height reaches a huge finite triangular range',
    formula: 'x ≤ [H/(log H+2)]⁸ ≈ 8.25×10⁸⁷',
    detail:
      'The first-Riesz formula transfers critical-line verification through H to the staged x¹⁵ᐟ⁸ estimate on this bounded range. ' +
      'A fixed height cannot prove the asymptotic inequality or any new zero strip.',
  },
  {
    id: 'T59',
    color: ED.brass,
    status: 'EXACT FINITE CRITERION · RH-EQUIVALENT',
    title: 'One complete Pascal row measures the prime-square bias',
    formula: 'RH ⇔ ∏p≤N pᴺ⁻ᵖ ≤ ∏k=0ᴺ C(N,k) eventually',
    detail:
      'Prime squares dominate the complete critical-zero boundary under RH; Landau positivity gives the converse. ' +
      'The equivalent global radix cancellation remains open and is not a proof of RH.',
  },
  {
    id: 'T60',
    color: ED.series3,
    status: 'FIXED-MAJORANT ROUTE REFUTED',
    title: 'Fixed majorants lose the triangular scale',
    formula: 'uniform target-scale sampling ⇒ ∫(Fₓ−w)du = O(x⁻¹ᐟ⁸)',
    detail:
      'Every fixed strict PNT-admissible majorant adds δx² by weighted-PNT partial summation, overwhelming x¹⁵ᐟ⁸. ' +
      'For an x-dependent family with target-scale uniform sampling, preserving the bound requires vanishing excess; standard bandlimited extremal families then require growing bandwidth.',
  },
  {
    id: 'T61',
    color: ED.series1,
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
    color: ED.series5,
    status: 'FIRST RADIX LAYER · RH-EQUIVALENT',
    title: 'The first radix layer already carries the full criterion',
    formula: 'RH ⇔ Σp≤N [Cₚ(N)−(N−p)]log p ≥ 0 eventually',
    detail:
      'The omitted higher-radix tail satisfies H_N≥0 and H_N∼−ζ(1/2)N³ᐟ²/3; under RH the first layer retains normalized margin 0.1336904124…. ' +
      'Conversely its eventual sign implies the T59 Pascal comparison. This exact criterion remains open and is not a proof of RH.',
  },
  {
    id: 'T63',
    color: ED.series3,
    status: 'ADAPTIVE SELBERG · EXACT NO-GAIN THEOREM',
    title: 'Growing bandwidth reaches—but does not beat—the staged scale',
    formula: '∫(GΩ−g)=π/(2Ω), sample(GΩ−g)=O(Ω⁻¹), Ω ≍ x¹ᐟ⁸',
    detail:
      'Layered Selberg interval majorants give a positive bandlimited cover with target-scale continuous and sampled excess. ' +
      'More generally, any tight positive x-dependent majorant satisfies 𝒮g≤𝒮F+ε, even without translation invariance. The canonical Fourier multiplier also retains a nonlinear residual phase, so the required arithmetic cancellation remains open.',
  },
  {
    id: 'T64',
    color: ED.series3,
    status: 'ENDPOINT MODEL SPACES · FIXED-BAND ROUTE CLOSED',
    title: 'High residual poles escape every fixed detector band',
    formula: 'Uₐ*QUₐ−Q = P_{I·conj(J)·K_J} − P_{K_I}',
    detail:
      'Residual poles are the positive model-space component, but their compression into any fixed band tends to zero as height escapes. ' +
      'An explicit half-strip Schur function also has an indefinite original linear-denominator kernel. T66 analyzes one zero-adaptive common-domain family; global and uniform adaptive inequalities remain open.',
  },
  {
    id: 'T65',
    color: ED.brass,
    status: 'RADICAL MELLIN KERNEL · ZERO-COMPLETE',
    title: 'The first-radix shell retains every zeta-zero obstruction',
    formula: '𝒦(s) = ((s−1)ζ(s)−1)/(s(s+1));  𝒦(1)=0, 𝒦(ρ)=−1/[ρ(ρ+1)]',
    detail:
      'The first-radix defect is log(ℜ_N/P_N), including an exact divisor endpoint correction. The existence of a one-sided −CσN¹⁺σ lower bound is equivalent to Re ρ≤σ, ' +
      'while exact radical recurrences prove the sequence is neither eventually monotone, log-convex, nor log-concave.',
  },
  {
    id: 'T66',
    color: ED.series5,
    status: 'FINITE RESIDUAL WITNESSES · NO UNIFORM GAIN',
    title: 'A zero-adaptive family geometrically isolates a residual direction',
    formula: 'k_X(x) ∝ e⁻⁽β⁺ⁱᴸ⁾ˣ1[0,X]  ⇒  ‖P_KI A_X‖→0, |⟨A_X,wρ⟩|→|M_S|',
    detail:
      'Exact theta and beta-integral cancellation suppress the base-zero model space and isolate one residual-pole coordinate; a polynomial factor supplies a direction for each strict multiplicity excess. ' +
      'T67 transfers the strict defect to an actual finite exponential matrix. Support, rate, margin, approximation degree, and conditioning remain zero-dependent, so no uniform inequality follows.',
  },
  {
    id: 'T67',
    color: ED.series3,
    status: 'PROVED COMPACT GRAPH THEOREM',
    title: 'Tail exponentials capture both theta feature graphs',
    formula: 'g∈C_c^∞  ⇒  eⱼ∈ℰ_L,  ‖T̃ₐE(eⱼ−g)‖₂+‖S̃ₐE(eⱼ−g)‖₂→0',
    detail:
      'Weighted-supremum bounds and Weierstrass approximation give compressed graph convergence for compact continuous inputs. ' +
      'Boundary-jet polynomial approximation plus Mellin Plancherel upgrades compact smooth inputs to full homogeneous graph convergence; this is not a core theorem for the entire maximal domain.',
  },
  {
    id: 'T68',
    color: ED.brass,
    status: 'PROVED SQUAREFREE CARRY FACTORIZATION',
    title: 'The radical quotient is one least-digit carry row',
    formula: 'Cᴿ(N,j)=G(N)/[G(j)G(N−j)],  vₚ(Cᴿ(N,j))∈{0,1},  ∏ⱼCᴿ(N,j)=ℜ_N',
    detail:
      'Each entry is squarefree, records the least base-p carry, divides its Pascal-row counterpart, and loses only O(√N) logarithmically from higher carries. ' +
      'The comparator is the primorial staircase ∏j#, but coordinatewise domination fails and ℜ₈/P₈ = 2401/24300 < 1.',
  },
  {
    id: 'T69',
    color: ED.series3,
    status: 'CRITICAL BLOCK AVERAGE · RH-EQUIVALENT',
    title: 'A √N/log N consecutive-row sign is still zero-complete',
    formula: 'W_N=⌊√N/log(2N)⌋:  RH ⇔ Σ(h=0…W_N) L⁽¹⁾(N+h) ≥ 0 eventually',
    detail:
      'The one-sided recurrence converts block nonnegativity into L_N⁽¹⁾ ≥ −N³ᐟ², while RH gives eventual positivity term by term. ' +
      'This is a weaker-looking averaged arithmetic target, but its reverse direction uses T65 and the averaged sign remains unproved.',
  },
  {
    id: 'T70',
    color: ED.accent,
    status: 'UNIFORM LOCAL CARRY SHORTCUTS FAIL',
    title: 'All-N and primewise block proofs break',
    formula: 'm≥2: Σ(r=0…p−1) vₚ(ℜ_{mp+r}/P_{mp+r}) = −p(m−1)(p+1)/2',
    detail:
      'Critical block columns can decrease before their midpoint, refuting a uniform/all-N monotonicity shortcut; every completed low-prime residue cycle is strictly negative once m≥2. ' +
      'The summed worst-case Pascal loss also costs coefficient 1·N³ᐟ², too large even under RH. Eventual column structure, T69, and RH remain unrefuted.',
  },
  {
    id: 'T71',
    color: ED.series1,
    status: 'POSITIVE POTENTIAL · DERIVATIVE SIGN OPEN',
    title: 'The first-radix defect is a sampled right tangent',
    formula: '𝔘(x) ≥ 0,  𝔘(x)→γ_E/2,  N³𝔘′₊(N)=L_N⁽¹⁾',
    detail:
      'Integrating the sawtooth kernel exposes a nonnegative primitive and an exact convergent arithmetic potential. ' +
      'Its prime component already decreases at x=3.99, so potential positivity controls neither the derivative nor RH.',
  },
  {
    id: 'T72',
    color: ED.series1,
    status: 'EXACT BLOCK CALCULUS · SIGN STILL OPEN',
    title: 'The positive potential has affine drift and radical resets',
    formula: 'G(x)=L⁽¹⁾ₙ−𝒞ₙ(x−n);  S(N,H)=∫x³𝔘′(x)dx + ½Σ𝒞ₙ',
    detail:
      'The integer jumps are n·log rad(n+1), and the critical block receives a positive (1/2+o(1))N³ᐟ² sampling correction. ' +
      'PNT control is too coarse at the required local scale; eventual continuum or sampled increase of 𝔘 is itself RH-equivalent.',
  },
  {
    id: 'T73',
    color: ED.brass,
    status: 'PRIME-SQUARE TRANSPORT · LOCAL SHORTCUTS FAIL',
    title: 'Positive carry mass lives above √N',
    formula: 'p²≤M ⇒ vₚ(ℜ_M/P_M)≤0;  Δ₁=1/8,  Δₘ<0 for every fixed m≥2',
    detail:
      'Every proof using the prime decomposition must compensate the nonpositive p≤√N sector from above the prime-square threshold. ' +
      'Fixed-cell asymptotics are not uniform in growing m, and the positive N=10,11 block defeats descending-prefix product domination through prefix 17.',
  },
  {
    id: 'T74',
    color: ED.series5,
    status: 'QUANTIFIED POINTWISE TRANSPORT BRACKET',
    title: 'Low primes impose an exact load on reset intervals',
    formula: '−Q₊θ(H) ≤ Σₚ≤H Eₚlog p ≤ −Q₋θ(H);  High≥Q₊θ(H) ⇒ block≥0',
    detail:
      'One-wrap formulas isolate positive additive reset corrections on short harmonic intervals, while entering primes contribute t(p−t). ' +
      'When Q₋>0, a Q₋ payment is necessary and a Q₊ payment is sufficient. These are distinct pointwise thresholds: the positive N=152, H=2 block still falls below the Q₊ budget.',
  },
  {
    id: 'T75',
    color: ED.series3,
    status: 'CRITICAL TRANSPORT · RH-EQUIVALENT',
    title: 'The sufficient transport endpoint gives no asymptotic shortcut',
    formula: 'RH ⇔ High(N,W_N) ≥ Q₊(N,W_N)θ(W_N) eventually',
    detail:
      'Under RH the critical block is at least cN²/log N, while the Q₊ budget is only O(N²/log²N) and the low sector is nonpositive. ' +
      'Conversely the Q₊ threshold implies T69, hence RH. The exact reset split remains useful, but its full eventual endpoint is not a reduced target.',
  },
  {
    id: 'T76',
    color: ED.series1,
    status: 'EXACT CENTERED CORRIDOR · ENDPOINT RH-EQUIVALENT',
    title: 'Residue centering isolates a thin modular covariance',
    formula: 'D_low=D_cent+C_cov,  |C_cov|≤E_H=3HΘ₁(H)/16;  |S−Ξ|≤E_H',
    detail:
      'Cyclic-prefix summation shrinks T74’s pointwise uncertainty from Θ(NH²) to O(H³), or O(N³ᐟ²/log³N) at the critical window. ' +
      'Reset intervals collapse into weighted truncated radicals of N+d with an exact entrant correction. The covariance has both signs, and Ξ≥−E eventually is still RH-equivalent.',
  },
  {
    id: 'T77',
    color: ED.brass,
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
    color: ED.series3,
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
    color: ED.series1,
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
    color: ED.series5,
    status: 'POSITIVE OUTER SMOOTHING · ZERO WAVE RETAINED',
    title: 'A second averaging layer changes covariance, not the RH baseline',
    formula: '𝒜_N(ω)=L_N^(1)+o(N³ᐟ²);  zero multiplier=1+O_ρ(N⁻¹ᐟ²)',
    detail:
      'Every nonnegative weighting on a fixed C₀√N outer window retains the pointwise first-radix baseline with coefficient one. ' +
      'For the uniform double convolution, periodicity improves only the normalized covariance to O(N/log³N); it does not attenuate any fixed zero mode, so eventual positivity remains RH-equivalent.',
  },
  {
    id: 'T81',
    color: ED.accent,
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
    color: ED.brass,
    status: 'EXACT SQUARE-KERNEL BALLOT · WRONG-SIGN DEBT',
    title: 'The natural radical ballot sum is already the higher-radix correction',
    formula: 'H_N=(N−1)J_N−2Σm<N J_m=Σn≤N(2n−N−1)b(n)≥0;  L_N^(1)=ℓ_N−H_N',
    detail:
      'The sign is prime-powerwise, not a generic consequence of the signed ballot weights. H_N helps the full Pascal quantity ℓ_N, but is subtractive relative to the stronger first-radix target L_N^(1), and it changes by only o(N³ᐟ²) across every fixed sublinear power window. ' +
      'The local b-word sees only primes p≤√(N+N^δ). Its complementary high-prime first-layer sum differs from L_N^(1) by O(N³ᐟ²), so the corresponding lower bound remains zero-strip complete—and RH-equivalent at the endpoint. This is method-specific algebraic blindness, not an independence claim.',
  },
  {
    id: 'T83',
    color: ED.series3,
    status: 'SIGNED HAAR ATTENUATION · SUFFICIENT DRIFT OPEN',
    title: 'Mass-zero cancellation loses half a power; rebuilding the level gives it back',
    formula: 'A_r=adaptive L^(1) √N-block mean;  0≤κ≤3/2: eventually A_{r+1}−A_r≥−Cn_r^κ ⇒ Re ρ≤max{1/2,κ−1/2}',
    detail:
      'Adjacent equal-block Haar weights have an exact positive-tent increment form. For fixed ρ and Y+H=o(N), each zero mode is multiplied by (ρ+1)Y/N+O_ρ(Y(Y+H)/N²), but the resulting 1/ρ coefficients are not absolutely summable. ' +
      'Telescoping adaptive L^(1) √N-block means restores the lost half-power: an eventual O(N) lower drift bound, a fixed polylogarithmic relaxation of it, or nonnegative drift would be sufficient for RH. No converse is proved—RH is not known to imply these drift conditions, and the two checked finite Haar signs do not decide an eventual sign.',
  },
  {
    id: 'T84',
    color: ED.brass,
    status: 'HARMONIC COMPENSATION · RH-COMPLETE AT √N DEPTH',
    title: 'The positive top cell is discharged by the lower harmonic cells',
    formula: 'G_K^cell=M_K+Q_K;  M_K=N²K/[2(K+1)²]−N(ℋ_{K+1}−1);  K≈√N: Q_K≥−CN¹⁺σ ⇔ Re ρ≤σ',
    detail:
      'The first-radix coefficient is affine on each prime cell (N/(m+1),N/m], with positivity confined to a short terminal sliver. Exact telescoping cancels the N²/8 top-cell subsidy down to N²K/[2(K+1)²]. ' +
      'Quantitative PNT control proves positivity only for subpower harmonic depth. At K≈√N, the centered quadrature differs from the complementary high-prime channel below the critical scale and its N¹⁺σ lower bound is exactly the zero-strip criterion—RH-equivalent at σ=1/2. This is a no-gain classification, not the missing bound.',
  },
  {
    id: 'T85',
    color: ED.series5,
    status: 'ADAPTIVE CHANNEL SPLIT · CROSS-CORRELATION OPEN',
    title: 'The signed drift is prime error minus the repeated-prime ballot debt',
    formula: 'A_{r+1}−A_r=−Δ_rVθ−Δ_rH+Δ_rΓ;  |Δ_rH|≪N⁴ᐟ³(log N)¹ᐟ³;  RH ⇔ Δ_rVθ≤CN log²N eventually',
    detail:
      'The exact unequal-width tent separates the adaptive L^(1) block drift into a prime-error channel, the higher-radix ballot channel, and a deterministic O(√N log N) Pascal term. A refined divisor switch improves the ballot estimate to O(N⁴ᐟ³(log N)¹ᐟ³), but its N¹ᐟ³ reset-count loss remains a method barrier. ' +
      'Controlling the prime-error drift separately at N log²N is already RH-equivalent. The genuinely new sufficient target is a direct upper bound Δ_rH+Δ_rVθ≤CN(log N)^A; it is unproved, and T86 below identifies its exact extra condition.',
  },
  {
    id: 'T86',
    color: ED.series1,
    status: 'PRIME-POWER RENORMALIZATION · SECOND CONDITION EXPOSED',
    title: 'Completing θ to ψ preserves the zero wave and isolates the radix noise',
    formula: 'Vθ+H=Vψ+K;  B_W ⇔ RH ∧ B_K;  Var_nat(R_H)≫√H log H (fixed H first)',
    detail:
      'The exact defect K=H−(Vψ−Vθ) is a first-radix sum over higher prime powers. Its renewal summands place copied singularities at scaled locations 1/j and ρ/j, so it has no copy of the original right-half zero pole at ρ and cannot provide mode-by-mode cancellation of Vψ. ' +
      'The proposed cross-channel N·polylog bound is therefore exactly RH conjoined with a separate one-sided N·polylog bound for ΔK. A natural-density calculation proves fixed equal-width tent variance ≫√H log H, but the limit takes the averaging range to infinity before H grows; it neither reaches H≈√N on the adaptive starts nor refutes the one-sided target. RH remains open.',
  },
  {
    id: 'T87',
    color: ED.series3,
    status: 'MACRO DILATION ESCAPE · HARMONIC SIGN LADDER',
    title: 'A nonlocal secant removes the extra radix condition but remains zero-complete',
    formula: '𝔇₄F=N⁻¹ᐟ²(F(4N)−8F(N));  Re ρ≤σ ⇔ 𝔇₄Vθ≤CN^(σ+1/2)',
    detail:
      'Every finite signed local filter retains an exact large-prime-square variance tail, while the adaptive starts form a zero-density quadratic set that is already nonuniform modulo 4. Those facts block a naive density transfer but do not prove a one-sided failure. ' +
      'At macroscopic width, the entire higher-radix secant is O(N), every off-critical zero mode survives, and the remaining prime-only weighted-PNT estimate is exactly the zero-strip criterion; at σ=1/2 it is RH-equivalent and unproved. In a separate intermediate theorem, RH implies G_floor(N^α)^cell>0 for α<1/3, and the α=1/8 sign implies T47. RH remains open.',
  },
  {
    id: 'T88',
    color: ED.series3,
    status: 'POSITIVE ANNULAR COMPARATOR · STRICT REDUCTION',
    title: 'RH is equivalent to one nonnegative prime tent on (N, 4N]',
    formula: 'RH ⇔ 2Σ_{N<p≤2N}(p−N)log p + Σ_{2N<p≤4N}(4N−p)log p ≤ 3N² eventually',
    detail:
      'The dilation L₊F=F(4N)−3F(2N)+2F(N) cancels every prime p≤N and leaves only nonnegative triangular weights in one fixed annulus. ' +
      'On RH, the retained prime-square bias dominates the complete critical-zero wave and gives L₊Vθ≤−(0.155951…−o(1))N³ᐟ². Conversely, the eventual non-strict inequality recovers a one-sided Vψ=O(N³ᐟ²) bound and hence RH. This is the base positive-annular reduction that T91 narrows; its inequality remains open.',
  },
  {
    id: 'T89',
    color: ED.series5,
    status: 'DILATION SIGN BARRIER · HARMONIC ZERO RESTORATION',
    title: 'Removing the square bias necessarily restores a signed zero wave',
    formula: 'Q(3/2)=0 ⇒ ∫w(u)u⁻¹ᐟ²du=0 ⇒ w changes sign;  c_K,N(ρ)=1/[ρ(ρ+1)]+o_ρ(1)',
    detail:
      'Every nontrivial finite dilation that notches the N³ᐟ² prime-square mode has a sign-changing prime spline. The exact annular filter F(64N)−13F(16N)+44F(4N)−32F(N) preserves every off-critical zero and is Ω±(N³ᐟ²) on RH, so it cannot support an eventual-sign shortcut. ' +
      'The polynomial-depth harmonic quadrature behaves the same way spectrally: cross-cell summation cancels the artificial K-loss but restores each fixed zero’s first-Riesz coefficient. At α=1/8, failure of T47 forces unbounded normalized negative excursions. RH remains open.',
  },
  {
    id: 'T90',
    color: ED.brass,
    status: 'ANNULAR LCM FACTORIZATION · SQUARE-ONLY STRENGTHENING',
    title: 'The positive tent splits exactly into prime-power layers',
    formula: 'RH ⇔ L₊Vψ(N)≤log Q₂,N eventually;  A_N=∏ₐQₐ,N=∏_{m=N}^{2N−1} lcm(1…2m)lcm(1…2m+1)/lcm(1…m)²',
    detail:
      'The full Λ-weighted annulus is one integer lcm quotient, and its square layer is an explicit product over √N<p<2√N. Cubes and higher contribute only O(N⁴ᐟ³), so the T88 RH margin proves the square-only ψ-completed inequality; conversely, subtracting every higher layer recovers the T88 prime sign. ' +
      'Only the square factor cancels, leaving the cube-and-higher tail as a pointwise strengthening rather than an easier theorem. The annular Pascal-row comparison is RH-equivalent, while the canonical central-binomial divisibility majorant costs 6log2·N² instead of the allowed 3N². RH remains open.',
  },
  {
    id: 'T91',
    color: ED.series3,
    status: 'NARROWER POSITIVE ANNULUS · STRICT SUPPORT REFINEMENT',
    title: 'A zero-complete rational tent shrinks the support below factor four',
    formula: 'RH ⇔ 17Σ_{81N<p≤153N}(p−81N)log p + 9Σ_{153N<p≤289N}(289N−p)log p ≤ 127296N² eventually',
    detail:
      'For the geometric family Qₐ(s)=(aˢ−1)(aˢ−a), every multiplier zero lies on Re s=0 or 1, while the prime kernel stays nonnegative. The certified RH margin turns positive at a=1.882453339…, so rational supports can approach the ratio 3.543630574… from above. ' +
      'The low-complexity choice a=17/9 has support ratio 289/81=3.567901… and RH deficit (48.820170…−o(1))N³ᐟ². Generic positive tents need not be zero-complete, and this narrower eventual inequality is still unproved. RH remains open.',
  },
  {
    id: 'T92',
    color: ED.series1,
    status: 'JOINT ZERO-COMPLETENESS · SHARP METHOD FLOOR',
    title: 'Two positive tents remove each other’s blind multiplier zeros',
    formula: 'c=124/123; m=61,62; support c¹⁵³=3.4517217537; T92 concave-floor b*=3.4513363850',
    detail:
      'The two rational-mesh multiplier polynomials have exact common gcd (z−1)(z−c), certified by a degree-two gcd modulo 1,000,003. Their RH margins are separately positive, so the conjunction of their eventual prime signs is RH-equivalent even though a generic single positive tent may hide an off-critical mode. ' +
      'A Green-measure decomposition shows that the certified amplitude ratio of every concave positive piecewise-linear annular kernel is a denominator-weighted average of single-tent ratios. Thus no number of scales reaches support b≤3.4513363850 under the global absolute-amplitude certificate, while three consecutive filters approach that floor from above. T95 extends the same floor to all finite nonnegative piecewise-linear kernels. Neither theorem proves an eventual sign.',
  },
  {
    id: 'T93',
    color: ED.series3,
    status: 'VERIFIED-ZERO ANNULUS · STRICT SUPPORT REDUCTION',
    title: 'The first 1,000 zeros cut the positive support to 529/225',
    formula: 'RH ⇔ 23Σ₂₂₅N<p≤₃₄₅N(p−225N)log p + 15Σ₃₄₅N<p≤₅₂₉N(529N−p)log p ≤ 419520N² eventually',
    detail:
      'A 256-bit FLINT/Arb certificate isolates the first 1,000 nontrivial zeros, independently counts exactly 1,000 zeros through the midpoint after γ₁₀₀₀, and spends those conjugate-pair amplitudes exactly. Under RH, every remaining zero is covered by the residual completed-zeta budget. ' +
      'For a=23/15 the rigorous margin is δ=0.00104911306566…>0.001, giving an integer-scaled RH deficit above 50.625N³ᐟ² and support ratio 529/225=2.351111…. The converse is the same zero-complete dilation argument. The displayed eventual inequality remains unproved, so RH remains open.',
  },
  {
    id: 'T94',
    color: ED.accent,
    status: 'FACTORIAL-COVER BARRIER · CROSS-FACTOR ROUTE OPEN',
    title: 'Rowwise binomial and multinomial covers overpay before the RH scale',
    formula: 'factorwise cost ≥2log2·127296N²; allowance=127296N²; unavoidable gap=49173.726993…N²',
    detail:
      'The rational annular cofactor factors exactly into paired primorial quotients. Each 17/9 quotient fits inside a true binomial coefficient, but uniform Stirling summation costs 187030.814660…N², already 59734.814660…N² too much. ' +
      'More generally, packing denominator parts proves a 2log2 lower cost per unit primorial-index gap for every factorwise multinomial cover. Prime squares and higher powers are lower order and cannot repay the N² loss. Any cofactor-factorial proof of T93 must use cancellation or carry transport across factors, not independent row covers.',
  },
  {
    id: 'T95',
    color: ED.series5,
    status: 'ALL-SPLINE METHOD FLOOR · GLOBAL-AMPLITUDE CLASSIFICATION',
    title: 'Nonconcavity cannot beat the global absolute-amplitude floor',
    formula: 'finite w≥0, PL on [1,B] ⇒ Qw(3/2)/‖Qw‖₁,₃ᐟ₂ ≤ max₁<u<B (L_B(u)−u³ᐟ²)/(L_B(u)+u³ᐟ²)',
    detail:
      'Writing μ=−w″ as signed curvature separates the positive-curvature gain from the negative-curvature amplitude cost. The exact endpoint moments show that negative curvature can only lower the certified response ratio; equality returns to the concave tent sector. ' +
      'Therefore b*=3.451336384960… is the sharp floor for every nonzero nonnegative continuous finite piecewise-linear annular kernel under the global coefficientwise zero budget. Signed kernels, smooth or infinite-scale families, and zero-aware budgets are deliberately outside this theorem.',
  },
  {
    id: 'T96',
    color: ED.series3,
    status: '50,000-ZERO ANNULUS · STRICT SUPPORT REDUCTION',
    title: 'A certified a=32/21 tent cuts support to 1024/441',
    formula: 'RH ⇔ 32Σ₄₄₁N<p≤₆₇₂N(p−441N)log p + 21Σ₆₇₂N<p≤₁₀₂₄N(1024N−p)log p ≤ 2154768N² eventually',
    detail:
      'A 256-bit FLINT/Arb run isolates the first 50,000 consecutive nontrivial zeros, independently proves the multiplicity-counted Turing total at height 40,433.958…, and leaves a nonnegative residual Hadamard budget. ' +
      'At a=32/21 it certifies δ=0.000705772803290…>7/10000. The support ratio is 1024/441=2.32199546485…, and the integer-scaled conditional deficit exceeds 136.1367N³ᐟ². The converse remains zero-complete; the eventual inequality itself is unproved.',
  },
  {
    id: 'T97',
    color: ED.brass,
    status: 'EXACT CROSS-FACTOR BALLOT · TESTED LOCAL SHORTCUTS FAIL',
    title: 'The annular cofactor is an adjacent Pascal/carry mean comparison',
    formula: 'log(S_N/C_N)=2760N(mean₃₄₅N≤u<₅₂₉N log K_u − mean₂₂₅N≤u<₃₄₅N log K_u)',
    detail:
      'The T93 prime product C_N and Pascal-row ratio S_N satisfy RH ⇔ C_N≤S_N eventually. Their quotient telescopes exactly into adjacent products of K_u=(u+1)^u/(u!·rad(u!)). ' +
      'K_u rises at composites and falls at primes; v₃(S_{3ᴸ}/C_{3ᴸ})=−4923·3ᴸ+15, so the direct C_N | S_N route fails on an infinite subsequence. Exact negative pair and block fixtures also defeat universal pairwise and per-block positivity. The open route is genuinely cross-factor cancellation, not independent row covering.',
  },
  {
    id: 'T98',
    color: ED.series1,
    status: 'UNCONDITIONAL RECURRENCE · CERTIFIED GLOBAL AVERAGE',
    title: 'The T93 slack is negative infinitely often—but not yet eventually',
    formula: 'D(N)<0 for infinitely many integer N;  ∫₁∞D(x)x⁻³dx < −25000',
    detail:
      'A Mellin/Landau argument proves eventual nonnegativity would force RH; the certified RH margin then contradicts it. Hence D(N)<0 infinitely often unconditionally, and if RH is false both strict signs occur infinitely often. ' +
      'A separate 256-bit prime-log interval certificate proves the absolutely convergent whole-range inverse-cubic average is below −25,000. This average has no tail or integer-sign implication. The precise missing PNT scale is also exposed: current unconditional errors remain far above the required N³ᐟ² bias. RH remains open.',
  },
  {
    id: 'T99',
    color: ED.series1,
    status: 'UNCONDITIONAL DEEP RECURRENCE · EXPLICIT LONG BLOCKS',
    title: 'The prime-square pole forces super-√N runs of valid scales',
    formula: 'liminf D₂₃,₁₅(N)/N³ᐟ²≤−11081.705…;  liminf D₃₂,₂₁(N)/N³ᐟ²≤−40805.171…',
    detail:
      'The negative real residue at the prime-square pole s=3/2 and Landau positivity force N³ᐟ²-scale negative checkpoints for both certified annuli, with no RH assumption and no appeal to their conditional margins. ' +
      'The explicit Fiori–Kadiri–Swidinsky PNT error then keeps each sufficiently late checkpoint negative across ⌊√N·exp(0.8√log N)⌋ consecutive scales. These starts can remain arbitrarily sparse, so long valid runs do not supply the eventual sign required for RH.',
  },
  {
    id: 'T100',
    color: ED.brass,
    status: 'SHARPEST EXACT CARRY BALLOT · AGGREGATE ROUTE OPEN',
    title: 'The 32/21 annulus inherits the full cross-factor bottleneck',
    formula: 'log(S*_N/C*_N)=7392N(mean₆₇₂N≤u<₁₀₂₄N log K_u − mean₄₄₁N≤u<₆₇₂N log K_u)',
    detail:
      'The T96 prime cofactor C*_N and Pascal ratio S*_N satisfy RH ⇔ C*_N≤S*_N eventually and telescope exactly into adjacent 32/21 blocks of K_u=(u+1)^u/(u!·rad(u!)). ' +
      'The identities v₁₉(S*_{19ᴸ}/C*_{19ᴸ})=−174·19ᴸ−15 and v₅(S*_{5ᴸ}/C*_{5ᴸ})=−28082·5ᴸ+29, together with exact negative pair and block factors, defeat direct divisibility and universal pair/per-block positivity. Independent factorial covers still overpay by at least 832,374.7279…N². The aggregate eventual sign remains RH-equivalent and unproved; RH remains open.',
  },
  {
    id: 'T101',
    color: ED.series3,
    status: 'ALL-INTEGER RH CRITERION · LONG BLOCKS PROVED · EVENTUAL SIGN OPEN',
    title: 'Proportional carry buffering exposes the exact aggregate frontier',
    formula: 'Fᵣ,ₛ(k)=Σₕ₌ₖ^⌊rk/s⌋⁻¹qᵣ,ₛ(h);  RH ⇔ Fᵣ,ₛ(sN+d)>0 eventually for each fixed d',
    detail:
      'At aligned k=sN the buffer is exactly log(S_N/C_N); for every k≥2 it is also a nonnegative trapezoidal prime/Pascal kernel whose endpoint dilation exponential polynomial has zeros only on Re z=0 and Re z=1. ' +
      'T99 now gives Fᵣ,ₛ(k)>0 on infinitely many consecutive intervals of length s√N·exp(0.8√log N)+O(1). Their gaps remain uncontrolled, and even one fixed residue lane is already RH-equivalent. Exact negative q-blocks defeat termwise induction, while full stop-loss majorization contains the same RH-complete terminal sum. No eventual sign is proved; RH remains open.',
  },
  {
    id: 'T102',
    color: ED.accent,
    status: 'EXACT BEATTY TRANSPORT · GLOBAL ALL-k SCALAR LAWS FAIL',
    title: 'The shared floor-word pattern transports block mass—not sign',
    formula: '2r=3s+1;  ΔF=(𝒯−I)q;  e(k+1)−e(k)=(1,2)^m,2',
    detail:
      'Both 23/15 and 32/21 use the same rational Beatty word. The exact operator 𝒯 expands q-blocks and telescopes complete cycles, but every residue transition compares mixed-sign lower and upper pieces. ' +
      'Exact rational K-products prove F(3)<F(2) for both ratios, F(4)>2F(2) for both, and pair-specific failures of superadditivity. This defeats the global all-k forms of ordinary/orbit monotonicity, 𝒯q≥q, subadditivity, and superadditivity. Eventual versions, nonlinear transport, and genuinely global induction remain unexcluded. The aggregate gap remains open.',
  },
  {
    id: 'T103',
    color: ED.series5,
    status: 'ZERO-STRIP THEOREM · SQUARE-ROOT LOCAL FILTERS RH-COMPLETE',
    title: 'Bounded-ℓ¹ local smoothing cannot bridge the proved blocks',
    formula: '𝒜(k)=Σⱼaₖ,ⱼF(k+j)≥0 eventually  ⇒  Re ρ≤max(1/2,δ)',
    detail:
      'For real weights with Σa=1, uniformly bounded Σ|a|, and H_k=k^(δ+o(1)), RH makes 𝒜(k)>0 for every δ<1. The converse forces the displayed zero strip. ' +
      'Hence every such signed or positive filter through δ=1/2 is exactly RH-equivalent, including rolling averages over √k·exp(0.8√log k), the T99/T101 block length. Growing coefficient ℓ¹ norms, wider fixed-power windows, and nonlinear global transforms are not classified as equivalences. RH remains open.',
  },
  {
    id: 'T104',
    color: ED.brass,
    status: 'FIXED-MODE CONDITIONING BOUND · CRITICAL COMPLEXITY REQUIRED',
    title: 'Attenuating one pole already leaves the safe local regime',
    formula: '|Mₖ(z)−1|≤C_z(Hₖ/k)‖aₖ‖₁;  |Mₖ(z)|≤η<1 ⇒ ‖aₖ‖₁≳k/Hₖ',
    detail:
      'For a normalized real mass-one additive local filter, let width be k^(δ+o(1)) and coefficient ℓ¹ norm be k^(τ+o(1)). RH preserves the filtered positive margin when δ+τ<1; an eventual nonnegative sign forces Re ρ≤max(1/2,δ+τ), so δ+τ≤1/2 is still RH-equivalent. ' +
      'More sharply, fixed-factor attenuation of even one fixed zeta-pole transfer amplitude along an unbounded sequence requires δ+τ≥1. The exact floored T101 multiplier has the same conditioning scale. Equality is only necessary, not sufficient, and the theorem does not rule out cross-mode cancellation, growing-height modes, multiplicative windows, or nonlinear global transforms. RH remains open.',
  },
  {
    id: 'T105',
    color: ED.series1,
    status: 'FINITE MULTIPLICATIVE NOTCHES · RH-SAFE BUT SPECTRUM-INCOMPLETE',
    title: 'Known pole modes can be removed without losing the equivalence',
    formula: 'P(z)=Σaνcνᶻ;  pℓ(z)=(Rℓ+qℓᶻ)/(Rℓ+1),  qℓ=e^(π/γℓ)',
    detail:
      'For fixed nonnegative mass-one dilation weights, a zero-free multiplier on 3/2<Re z<2 gives an exact RH-equivalent eventual buffer sign. Each positive two-scale factor exactly cancels one prescribed conjugate pair in the continued Mellin transform and cancels its leading floored power response; for verified critical-line modes its zeros stay on Re z=3/2 and |P(3/2+it)|/P(3/2)≤1. ' +
      'The construction costs multiplicative span exp(πΣ1/γℓ) and up to 2^n scales. A finite exponential polynomial has only O(T) zeros, so it cannot erase the T log T distinct zeta spectrum. Counting does not exclude cancellation of a finite or sparse off-line set; ruling that out requires a zero-free multiplier or a family with zero-free common set. The optimized arithmetic sign remains open, and RH is not proved.',
  },
  {
    id: 'T106',
    color: ED.accent,
    status: 'REAL PHASE-CANCELLATION BARRIER · QUADRATIC CONDITIONING',
    title: 'A real local filter needs second-order leverage to cancel one pole',
    formula: '|M(z)|≤η<|Im z|/|z|  ⇒  ‖a‖₁≳(k/H)²',
    detail:
      'For one fixed nonreal mode and real mass-one additive weights, the first-order response lies on the affine line 1+zℝ, a positive distance from zero. Stronger attenuation therefore costs quadratic conditioning, and an exact signed three-node pure-mode nuller attains that order. ' +
      'For the floored T101 response the necessary exponent is τ≥min(2(1−δ),1); hence δ+τ never enters the RH-stable subcritical regime. The bound applies only below the tangent-line threshold and is necessary—not a sign proof. Complex weights, cross-mode cancellation, multiplicative windows, and global transforms remain outside it. RH remains open.',
  },
  {
    id: 'T107',
    color: ED.series5,
    status: 'ADAPTIVE COMPLETE-WAVE BARRIER · BOTH SIGNS SURVIVE ON RH',
    title: 'Subcritical local adaptation cannot phase-lock a square-notched spectrum',
    formula: 'ℬ_P(k)=E_P(k)+o(k³ᐟ²)=k³ᐟ²{G_P(log k)+o(1)}=Ω±(k³ᐟ²)',
    detail:
      'Assume RH and let a nonzero fixed finite dilation multiplier satisfy P(3/2)=0. After k^(−3/2) normalization, its square-notched output is asymptotic to a complete nonzero mean-zero almost-periodic zeta wave. For arbitrary k-dependent real mass-one postfilter weights with width exponent δ, coefficient-ℓ¹ exponent τ, and δ+τ<1, a direct RH increment bound makes the postfilter asymptotically the identity on the whole unnormalized output. ' +
      'Positive and negative values therefore recur at full k^(3/2) scale; no eventual sign is possible. This closes cross-mode and growing-height adaptation only inside fixed finite square-notched channels. The positive-biased T101 buffer, critical/supercritical conditioning, adaptive multiplicative or infinite-scale filters, and nonlinear global mechanisms remain open. This is conditional no-go progress, not a proof of RH.',
  },
  {
    id: 'T108',
    color: ED.series3,
    status: 'EXACT PRIME-JUMP ABEL FORM · COMPENSATED MEAN FRONTIER',
    title: 'The scalar carry buffer is a difference of floor-aligned prime-error means',
    formula: 'eₖ=⌊rk/s⌋, H=eₖ−k;  Fᵣ,ₛ(k)=rsH{Ē[sk,seₖ]−Ē[rk,reₖ]−βᵣ,ₛ(k)}',
    detail:
      'The one-step q increment is exactly a nonnegative integer trapezoid applied to aₜ−1ℙ(t)log t. Here Ē[A,B] is the interval mean of ℰ(x)=θ(x)−x. Abel summation concatenates those steps into two floor-aligned geometric-block means, exactly adjacent when s divides k, minus an explicit positive compensation βᵣ,ₛ(k)=½log(r/s)+O(1/k). ' +
      'The exact inequality Ēlow−Ēhigh≥βᵣ,ₛ(k) is pointwise equivalent to Fᵣ,ₛ(k)≥0 and therefore remains RH-equivalent eventually; the asymptotic threshold alone is not a sign proof. The sequence ℓ_u+θ(u) is strictly discretely convex, but each prime p≥5 creates consecutive negative/positive curvature flips in ℓ_u=log K_u, ruling out eventual convexity and concavity. The missing one-sided mean estimate remains open, so RH is not proved.',
  },
  {
    id: 'T109',
    color: ED.series1,
    status: 'GLOBAL POSITIVE-KERNEL CUMULATIVE · TAIL FLOOR RH-EQUIVALENT',
    title: 'Critical damping turns any persistent lower floor into RH',
    formula: 'ℒ_d(X)=Σ₁≤N≤X F(sN+d)/N⁵ᐟ²;  limsup ℒ_d(X)/log X ≥ Bᵣ,ₛ unconditionally',
    detail:
      'For each fixed residue lane, the Mellin transform of ℒ_d has a positive double square-pole term Bᵣ,ₛ/w², while every off-line zero becomes a genuine pole at w=ρ−1/2 and no positive real singularity is available. Landau therefore makes RH equivalent even to ℒ_d being bounded below by one fixed constant on a tail; RH itself forces ℒ_d→+∞. ' +
      'Unconditionally the logarithmic limsup is at least 11081.705… for 23/15 and 40805.171… for 32/21, so positive cutoffs recur. If RH were false, negative excursions would be unbounded. The cumulative is an exact nonnegative-weight transform of the signed q-word, not a proof of its lower floor; fixed-order Riesz smoothing does not change this frontier. RH remains open.',
  },
  {
    id: 'T110',
    color: ED.series3,
    status: 'EXACT BUFFER IDENTITY · EVENTUAL ALL-U SIGN REFUTED BY T119',
    title: 'One terminal buffer absorbs every tested ordered drawdown',
    formula: 'Λᵣ,ₛ(k,u)=Fᵣ,ₛ(k)+Σₕ₌ₖᵘ⁻¹qᵣ,ₛ(h)=R(eₖ)+R(u)−2R(k)',
    detail:
      'Exactly, Λ(k,k)=F(k), Λ(k,eₖ)=2F(k), and its prime-jump kernel is the sum of two nonnegative trapezoids. Thus eventual positivity for every intermediate endpoint would imply RH by taking u=k. T119 proves the stronger all-u statement is actually false: on RH an explicit zero phase forces recurrent negative interior values, while false RH forces recurrent negative endpoints through the same endpoint equivalence. ' +
      'The original segmented floating-point scan through k=10,000,000 recorded 3,859,528 and 4,486,170 negative-prefix rows; the largest drawdown/F ratios were 0.2283912077656336 at (k,u)=(7,628,178,8,318,225) and 0.25101434521808685 at (5,422,030,5,985,169), with both leading candidates confirmed by an 80-decimal replay. T118 extended both pairs through k=100,000,000 with no nonpositive F or Λ, and the replayed global ratio records were unchanged. T119 therefore also demonstrates why that large finite scan could not certify the eventual conjecture. RH remains unresolved.',
  },
  {
    id: 'T111',
    color: ED.brass,
    status: 'JOINT STRICTLY-INTERIOR RH EQUIVALENCE · RIGOROUS ZERO BUDGET',
    title: 'Two interior terminal samples remove every shared spectral blind spot',
    formula: 'RH ⇔ Λ₂₃,₁₅(15N,21N)>0 and Λ₂₃,₁₅(15N,22N)>0 eventually; likewise Λ₃₂,₂₁(21N,30N)>0 and Λ₃₂,₂₁(21N,31N)>0 eventually',
    detail:
      'For fixed a=r/s and μ=u/k, the aligned multiplier is Qₐ,μ(z)=(aᶻ−a)(aᶻ+μᶻ−2). A single interior channel is not known to be zero-complete, but two distinct μ values have no common zero for Re z>1. A joint Landau argument therefore makes each displayed pair exactly RH-equivalent without sampling u=k or u=eₖ. ' +
      'A rigorous first-1,000-zero Hadamard calculation gives normalized RH margins 0.081756190211… and 0.080656676211… for μ=21/15,22/15, and 0.071829396271… and 0.056638665860… for μ=30/21,31/21. These correspond to N³ᐟ² margins 4138.907…, 4083.244…, 13969.453…, and 11015.144…. The prime-square pole also proves sparse unconditional positive blocks of length N^(1/2+o(1)) on each line, not an eventual sign. This proves the paired interior criteria; T119 later disproves the stronger all-u sign. RH remains open.',
  },
  {
    id: 'T112',
    color: ED.accent,
    status: 'SINGLE STRICT-INTERIOR RH EQUIVALENCE · ARB/TURING CERTIFIED',
    title: 'One interior ordering carries the complete zero obstruction',
    formula: 'RH ⇔ Λ₃₉,₂₅(24N,34N)−Λ₃₉,₂₅(24N,25N)>0 eventually ⇔ ∏₉₇₅N≤u<₁₃₂₆N Kᵤ²⁵ > ∏₆₂₅N≤u<₈₅₀N Kᵤ³⁹ eventually',
    detail:
      'Both endpoints are strict interior samples because 24N<25N<34N<⌊39·24N/25⌋. Their difference cancels the common terminal buffer and leaves one nonnegative plateau trapezoid on [625N,1326N], with exact mass 3,624,075N² and multiplier Q(z)=((39/25)ᶻ−39/25)((34/25)ᶻ−1). Its zeros lie only on Re z=1 or Re z=0, so a one-sided Landau converse has no off-line blind spot. ' +
      'A 256-bit certificate isolates and exactly counts the first 10,000 zeros through height 9878.218713…, proving normalized margin 0.000726680570605…>7/10000 and restored RH margin 283.859597892608…N³ᐟ². The support ratio 1326/625=2.1216 improves T96’s 1024/441. T121 later rules out the natural equal-or-larger monotone cross-prime/factor transport proof. No unconditional eventual product sign is proved: this is a sharper one-comparator RH equivalence, not a proof of RH.',
  },
  {
    id: 'T113',
    color: ED.series5,
    status: 'UNCONDITIONAL DEEP RECURRENCE · LONG POSITIVE PRODUCT BLOCKS',
    title: 'The single comparator wins deeply on infinitely many whole blocks',
    formula: 'limsup ΔN/N³ᐟ² ≥ BΔ;  BΔ=650(√39−5)(34√34−125)=59279.380606…',
    detail:
      'The k=2 prime-square pole gives the T112 centered prime slack a negative Mellin residue −BΔ. A one-sided Landau argument therefore forces liminf DΔ(N)/N³ᐟ²≤−BΔ, while the exact archimedean loss is only E_N<2,899.26N. Hence the exact T112 log-product ΔN has unconditional limsup at least BΔ. ' +
      'The explicit PNT derivative estimate propagates those deep checkpoints: for every 0<ε<BΔ, infinitely many complete blocks N≤n≤N+⌊√N exp(0.8√log N)⌋ satisfy Δn>(BΔ−ε)n³ᐟ², so the product ratio exceeds exp((BΔ−ε)n³ᐟ²) throughout each block. Exact checks find q₃₉,₂₅(28)<0 and K₁₀₆₃<K₆₉₇; for every L≥0, the 2-adic exponent is positive at N=2^L and the 3-adic exponent is negative at N=3^L, while the canonical prime-jump fixed-step kernel also changes sign. Their starting points may still have arbitrary gaps. This proves deep recurrence and closes naive shortcuts, not eventual positivity or RH.',
  },
  {
    id: 'T114',
    color: ED.series1,
    status: 'POWER-CUMULATIVE RECURRENCE · NATURAL FLOOR RH-EQUIVALENT',
    title: 'Every power weighting keeps the off-line pole to the right',
    formula: 'α≤5/2, κ=5/2−α:  limsup ℒα(X)/Gκ(X) ≥ BΔ;  RH ⇔ ℒα(X) ≥ −CX^κ on a tail',
    detail:
      'Set ℒα(X)=ΣN≤XΔN/N^α and Gκ(X)=(X^κ−1)/κ, with G₀(X)=log X. Its Mellin transform is ΦΔ(w+α)/w: the positive prime-square pole sits at w=κ, while every zero with Re ρ>1/2 creates a genuine pole at w=κ+ρ−1/2, strictly farther right. Landau’s theorem therefore makes even the natural-scale one-sided floor −CX^κ equivalent to RH. Unconditionally, the square residue proves limsup ℒα/Gκ≥BΔ=59279.380606…. ' +
      'Exactly, ℒα is a nonnegative-incidence transform of the signed q₃₉,₂₅ word. But the incidence rises at isolated multiples of 25 and falls at isolated multiples of 34, q₃₉,₂₅(28)<0 receives weight 1, and the induced K coefficients include λ(625)=−39 and λ(975)=25. Fixed-order Riesz smoothing cancels no pole. For 2<α≤5/2, the lower gain certified by one T113 block is only o(1), with uncontrolled gaps. No natural-scale tail floor is proved, so RH remains open.',
  },
  {
    id: 'T115',
    color: ED.series3,
    status: 'UNCONDITIONAL MOVING-HEAT EXTRACTION · POWER-GAP THEOREM',
    title: 'Every 29/25 power window contains a deep valid comparator',
    formula: 'ℋΔ(X)=ΣN≥1 ΔN N⁻⁵ᐟ² 𝒦X(N/X) → BΔ;  ∀Y≫1 ∃N∈[Y,Y²⁹ᐟ²⁵]: ΔN>(BΔ−ε)N³ᐟ²',
    detail:
      'Take T_X=2log X/783 and the positive log-Gaussian 𝒦X(y)=(4πT_X)⁻¹ᐟ²exp(−(log y)²/(4T_X)). Its Mellin response is X^(w+2w²/783). A fixed finite-rectangle shift preserves the real prime-square residue BΔ=59279.380606… while every critical or hypothetical off-line zero residue decays; copied k=2 zero modes decay as well, and k≥3 renewal singularities stay left of the contour. Thus ℋΔ(X)=BΔ+o(1) unconditionally. ' +
      'Using only ΔN=O(N²), the tails outside X^(1±2/27) are o(1), including the boundary’s (log X)⁻¹ᐟ² gain. The remaining positive weights have total mass 1+o(1), forcing some N in the window to satisfy ΔN/N³ᐟ²≥BΔ−o(1). Reparameterizing gives one exponentially deep T112 product win in every [Y,Y^(29/25)]. This closes arbitrary power-size gaps, but not all gaps or the eventual sign: the window changes with X and deliberately suppresses off-line modes too. RH remains open.',
  },
  {
    id: 'T116',
    color: ED.series1,
    status: 'VERIFIED-HEIGHT HEAT SHARPENING · NEAR-UNIT POWER GAPS',
    title: 'Every almost-unit power window contains a whole deep block',
    formula: 'H=3,000,175,332,800; θH=(2H+1)/(2H−3)=1.0000000000006666277…; liminf log Pε(X)/log X ≥ 1/(2θH)',
    detail:
      'Take A_H=2H²−½ and T_H,X=log X/A_H in the T115 log-Gaussian. Platt–Trudgian verification puts every nontrivial zeta zero through |γ|≤H on Re ρ=½. Verified modes decay as X^(−γ²/A_H); any hypothetical off-line mode must have |γ|>H and still has strictly negative heat exponent. Copied k=2 modes also decay. The proof selects a fixed contour R∈(2H,2H+1), above 6.00035×10¹², so the threshold is existential and extremely ineffective. ' +
      'The exact localization radius is δH=2/(2H−1), giving θH=6000350665601/6000350665597. For every fixed 0<ε<BΔ, every sufficiently large [Y,Y^θH] contains a witness with ΔN>(BΔ−ε/2)N³ᐟ²; the symmetric T113 derivative estimate expands it inside that same window to JN+1 consecutive deep wins, JN=⌊√N exp(0.8√log N)⌋. With Pε(X)=#{n≤X: Δn>(BΔ−ε)n³ᐟ²}, the lower logarithmic exponent is at least 0.4999999999996666861…. This gives double-log-scale syndeticity, not additive o(N) gaps, positive natural/log density, eventual positivity, or RH: the moving filter suppresses hypothetical off-line zeros instead of excluding them.',
  },
  {
    id: 'T117',
    color: ED.series5,
    status:
      'INFINITE ZERO-ADAPTIVE NOTCH · EXACT CLASSIFICATION · NO INDEPENDENT ARITHMETIC SIGN',
    title: 'The complete fixed critical-wave notch remains RH-equivalent',
    formula:
      'R₀(w)=∏γ cosh(πw/(2γ));  𝒢Δ=−E[e⁻³Yᐟ²FΔ(e^Yx)];  RH ⇔ 𝒢Δ/x³ᐟ²→BΔ ⇔ ∃C<∞: 𝒢Δ≥−Cx³ᐟ² on a tail',
    detail:
      'Let γ run over the distinct ordinates of zeros actually on Re ρ=½. Since Σγ⁻²<∞, the Rademacher series Y=Σεγπ/(2γ) converges and R₀(w)=E exp(wY) is entire. Its zeros are purely imaginary: R₀(iγ)=0 cancels every leading critical-line pole, R₀(0)=1 preserves the prime-square residue, and R₀(d+iγ)≠0 for d≠0 preserves every hypothetical off-line pole. The positive multiplicative expectation is exact over its probability law; no density or smoothness is assumed. ' +
      'On RH, the normalized first-Riesz formula is BΔ minus an absolutely convergent critical zero wave; the characteristic factors eliminate that whole wave and give 𝒢Δ(x)/x³ᐟ²→BΔ. Conversely, Landau makes even one tail floor 𝒢Δ≥−Cx³ᐟ² imply RH. Unconditionally limsup 𝒢Δ/x³ᐟ²≥BΔ, while false RH forces liminf 𝒢Δ/x³ᐟ²=−∞. This closes the infinite-product loophole left by finite T105 notches, but it imports the complete critical-line spectrum, has infinite scale support and no finite radical/product realization, and supplies no independent arithmetic sign. RH remains open.',
  },
  {
    id: 'T118',
    color: ED.brass,
    status:
      'SPARSE TERMINAL RECTANGLES · UNCONDITIONAL ENDPOINT LAYERS',
    title: 'Deep arithmetic buffers protect two growing prefix layers',
    formula:
      'Lk=⌊√k·exp(0.8476836√log k)/(log k)²⌋;  Λr,s(k,u)>0 for u∈[k,k+Lk]∪[ek−Lk,ek] on infinitely many deep row blocks',
    detail:
      'For either sharp pair 23/15 or 32/21, Stirling and the explicit Fiori–Kadiri–Swidinsky PNT estimate give |qr,s(h)|≪h(log h)³ᐟ²exp(−0.8476836√log h). Across Lk consecutive steps this is only O(k³ᐟ²/√log k)=o(k³ᐟ²). Combining that variation with the unconditional T99/T101 deep complete-buffer blocks proves simultaneous positivity throughout both endpoint layers on every row of infinitely many consecutive k-blocks. The central interval still has proportional width, where direct variation costs k^(2−o(1)) and does not fit inside the k³ᐟ² buffer. ' +
      'The proposed uniform low-zero proof also has a certified obstruction. At a=32/21 and μ=113/105, a 256-bit Arb/Turing calculation proves that the first 1,000 critical-mode absolute coefficients already exceed the square bias by 0.046053…>9/200. T118 alone did not determine the phase sign; T119 now supplies an explicit 10,000-zero phase and proves the stronger eventual all-u statement false. A finite scan through k=10⁸ still finds no nonpositive F or Λ, with maximal replayed drawdown ratio 0.2510143452…, illustrating the gap between finite evidence and the recurrent asymptotic sign. RH remains open.',
  },
  {
    id: 'T119',
    color: ED.accent,
    status:
      'EXPLICIT PHASE REVERSAL · EVENTUAL ALL-U POSITIVITY FALSE · RH OPEN',
    title: 'A certified 10,000-zero phase breaks the all-prefix conjecture',
    formula:
      'RH ⇒ liminf Λ₃₂,₂₁(105N,113N) / [21⁵ᐟ²(105N)³ᐟ²] < −9/1000;  unconditionally Λ₃₂,₂₁(k,u)<0 infinitely often',
    detail:
      'At (k,u,eₖ)=(105N,113N,160N), the RH explicit formula is a positive square bias plus an absolutely convergent critical-zero wave. A 1,152-bit Arb calculation at one exact rational phase encloses the first 10,000 conjugate-pair contributions at −0.251561551266345…, the bias at 0.237544635537161…, and the complete residual Hadamard tail at no more than 0.004583969610754…. The full upper bound is −0.009432946118431…<−9/1000, and an exact Turing count proves the 10,000-zero list complete through height 9878.218713…. Finite-polynomial almost-periodic recurrence, followed by nearest-integer sampling of log(2205N), reproduces this strict sign infinitely often on RH. No linear-independence hypothesis is used. ' +
      'The conclusion about the stronger conjecture is unconditional. If RH holds, those strict-interior negatives recur; if RH fails, the RH-equivalent endpoint condition Λ(k,k)=F(k)≥0 cannot hold eventually, so strict-negative endpoints recur. Thus eventual all-u positivity is false in either branch. Separately, all 17 integer-aligned middle channels have exact geometric subsequences with opposite-sign prime valuations, ruling out forward and reverse same-prime divisibility, fixed rational repairs, and o(N) valuation clearing. This is a subsidiary sign theorem: it refutes a stronger-than-RH conjecture but neither proves nor disproves RH. RH remains unresolved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_terminal_buffer_phase.c',
  },
  {
    id: 'T120',
    color: ED.brass,
    status: 'RECURRENT BRACKETED ISLAND · RH-CONDITIONAL ROUTE DIAGNOSTIC',
    title: 'The explicit phase forces a down-crossing and an up-crossing',
    formula:
      'RH ⇒ infinitely often sign Λ(105N,u) at u=(105,106,113,150,160)N is (+,+,−,+,+)',
    detail:
      'At the exact T119 phase, one shared 1,152-bit Arb/Turing computation proves W₁>47/1000, W₁₀₆⁄₁₀₅>9/250, and W₁₁₃⁄₁₀₅<−9/1000 with complete residual Hadamard tails. The T111 phase-uniform budget gives W₃₀⁄₂₁>1/20, and the endpoint identity is W₃₂⁄₂₁=2W₁. Joint finite-polynomial almost-periodic recurrence and integer log sampling preserve all five strict signs on infinitely many common rows under RH. ' +
      'Consequently some u₋∈[106N,113N−1] satisfies Λ(105N,u₋)≥0>Λ(105N,u₋+1), hence q(u₋)<0; later some u₊∈[113N,150N−1] satisfies Λ(105N,u₊)<0≤Λ(105N,u₊+1), hence q(u₊)>0. This brackets the negative component containing 113N. It is conditional on RH and refines the failed all-prefix route; it is not an RH proof.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_terminal_buffer_phase_geometry.c',
  },
  {
    id: 'T121',
    color: ED.series5,
    status: 'SELF-SIMILAR RADIX OBSTRUCTION · UNCONDITIONAL ROUTE NO-GO',
    title: 'Monotone cross-prime transport cancels before the square layer',
    formula:
      'log T_N=(9,643,725/2+o(1))N², log(X_N/T_N)=−(9,643,725/2+o(1))N²; Hall deficit at N=18 is 127',
    detail:
      'For the exact T112 product X_N=e^Δ_N, primes 850N<p≤975N contribute vₚ(X_N)=−17550N, while 975N<p≤1326N contribute 25(3p−2652N−1)>0. Pairing those sectors into the natural cross-prime quotient T_N creates a positive (9,643,725/2+o(1))N² payment, but the residual X_N/T_N has the opposite leading term. The N² transport gain therefore cancels before reaching the decisive N³ᐟ² prime-square layer. ' +
      'For the balanced endpoint tail J, exact rational identities give J(1/n)=0, J(4/(4n+1))=−7/(4n+1)², and J(2/(2n+1))=7/(2n+1)² for every n≥1, so the sign obstruction repeats in every reciprocal shell. At N=18 and threshold Kᵤ≥2¹⁵⁴, 25·6224=155600 upper factors cannot cover 39·3993=155727 lower factors: the Hall deficit is 127. Thus equal-or-larger monotone prime/factor transport is impossible; only nonmonotone global cancellation remains. This unconditional route diagnostic proves neither the sign of Δ_N nor RH.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T122',
    color: ED.series1,
    status:
      'THREE NESTED NEGATIVE INTERVALS · RH-CONDITIONAL MACROSCOPIC BLOCKS',
    title: 'One certified phase controls three width-versus-depth blocks',
    formula:
      '|μ−113/105|≤(1/64, 1/72, 1/128) ⇒ Wμ(t*)<−(10⁻⁶, 1/1000, 1/200)',
    detail:
      'At μ₀=113/105, a full 1,152-bit Arb computation isolates the first 10,000 critical-line zeros and proves their exact Turing count. Five disjoint adaptive rational-cell subdivisions reevaluate every selected mode at each midpoint, charge its derivative only across that cell, and include the full residual Hadamard tail. Across 649 evaluations and 327 certified leaves there are zero failures; the largest certified broad-side upper is −1.0163279232298775…×10⁻⁶ and the worst deep upper is −0.0050089216419658505…. Thus the three statements cover whole continua, not a finite μ grid. ' +
      'Assuming RH, C([1,a])-valued almost-periodic recurrence gives infinitely many common rows with exact nested blocks A_d,N=113N−⌊105N/d⌋ through B_d,N=113N+⌊105N/d⌋ for d=64,72,128. With k=105N, they contain k/32+O(1), k/36+O(1), and k/64+O(1) negative prefixes. Their negative-area coefficients are 21/6400000, 7/2400, and 21/2560 times ND_N, where D_N=21⁵ᐟ²(105N)³ᐟ². The widest block separates bounding sign changes by k/32+O(1); the deepest margin forces TV_[105N,160N] Λ≥(151/1000−o(1))D_N and Ω(N/log²N) increments of each sign. These consequences are conditional on RH and neither prove nor disprove it.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_terminal_buffer_phase_interval.c',
  },
  {
    id: 'T123',
    color: ED.brass,
    status:
      'EXACT WHOLE-BLOCK PRODUCT · UNCONDITIONAL POSITIVE LIMSUP / RH-CONDITIONAL NEGATIVE RECURRENCE',
    title: 'The deep prefix block aggregates to a sign-changing ballot',
    formula:
      'Y_N,δ=exp(Σ_{u=A_N}^{B_N}Λ₃₂,₂₁(105N,u)); unconditionally Y_N,δ>1 i.o; RH ⇒ Y_N,1/128<1 i.o.',
    detail:
      'Let G_M=B_M/P_M=∏_{v<M}K_v and L_N=2⌊105δN⌋+1. Multiplying every exact ordered prefix gives Y_N,δ={G₅₁₂₀N²¹G₂₂₀₅N⁶⁴/G₃₃₆₀N⁷⁴}^L_N∏_{u=A_N}^{B_N}G₃₂ᵤ²¹/G₂₁ᵤ³², simultaneously a finite factorial, prime-power, and Kᵥ comparison. Its shifted prime-square pole and an Oδ(N²) discrete-transfer lemma prove limsup log Y_N,δ/N⁵ᐟ²≥𝔅δ>0 unconditionally, hence Y_N,δ>1 infinitely often. For δ=1/128, RH plus T122 gives log Y_N,1/128≤−(21/2560−o(1))ND_N<0 infinitely often. Thus RH makes the exact product take both strict signs around one; this is recurrence, not a contradiction. ' +
      'The averaged multiplier has zeros z_n=log 2/log(32/21)+2πin/log(32/21)+O(1/n), with Re z_n→1.645595…>3/2. This blind lattice blocks the standard zero-free-multiplier/Landau converse only: no z_n is asserted to coincide with 1+ρ, and no alternative RH equivalence is disproved. At N=128, v₂(Y)=3544370084>0 while v₅(Y)=−9274951931<0, excluding divisibility in both orientations. Also G_{M+1}G_{M−1}/G_M² is >1 for composite M and <1 for prime M≥3, so neither global convexity nor concavity supports Jensen. These no-gos do not determine real order or RH.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T124',
    color: ED.series3,
    status:
      'OPEN-STRIP RESPONSE RIGIDITY · PURE-MODE HOMOGENEOUS RECTIFICATION NO-GO',
    title: 'An exact fixed-symbol adaptation freezes; rectification creates Landau’s real pole',
    formula:
      'Rτ|E independent of τ ⇒ ντ=ν;  Φ(U)=x^(dσ)h(log x) ⇒ 𝓜(Φ∘U)(s)=mΦ,b/(s−dσ)+O(1)',
    detail:
      'Let ντ be finite positive Borel measures with exponential moments on one common open strip, and let E have a limit point inside that strip. If Rτ(w)=∫eʷʸdντ(y) is independent of τ on E, the identity theorem extends that equality across the strip; tilting on one vertical line and applying Fourier-transform uniqueness then gives ντ=ν. Thus a positive multiplicative architecture with one exact scale-independent open-strip scalar response is not genuinely adaptive. ' +
      'For finitely many channels Uj(x)=bjx^(σ+iγ)+conj with γ≠0 and a continuous nonnegative positively homogeneous Φ of degree d>0, Φ(U(x))=x^(dσ)h(log x) with h periodic and nonnegative. Either h vanishes on the entire phase orbit, or its mean mΦ,b is positive and periodic summation gives a simple real Mellin pole at s=dσ with residue mΦ,b. For scalar amplitude A, positive part, absolute value, and square have residues A/π, 2A/π, and A²/2. Equality only on the discrete zeta-zero set, variable symbols, full multi-mode waves, adaptive nonlinearities, and genuinely global arithmetic transforms are outside the theorem. It proves neither RH nor that another RH equivalence is impossible.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T125',
    color: ED.series1,
    status:
      'FIXED L¹ BLOCK REWEIGHTING · BLIND-LATTICE ROBUSTNESS · DISCRETE LIMIT CAVEAT',
    title: 'Every fixed absolutely continuous block weight inherits the blind lattice',
    formula:
      'ℬϖ(z)=a^z−2+∫α^βϖ(μ)μ^z dμ;  z_n=log 2/log a+2πin/log a+o_ϖ(1)',
    detail:
      'For a>1, 0<α<β<∞, and one fixed density ϖ∈L¹([α,β]), the Mellin term I_ϖ and its derivative decay uniformly on every fixed disk translated to ζ_n=log 2/log a+2πin/log a. Rouché’s theorem then gives exactly one simple zero z_n=ζ_n+o_ϖ(1). For a=32/21, Re z_n→1.645595…>3/2. Bare L¹ regularity supplies no universal rate; bounded variation of the log-coordinate density restores O_ϖ(1/|n|). ' +
      'For exact integer multiplicities m_{N,u}, let M_N=Σ_um_{N,u} and ν_N=M_N⁻¹Σ_um_{N,u}δ_{u/(105N)}. The weighted-prefix response is exactly Q_{N,m}(z)=21^(z+1)(105N)^zM_N(a^z−a){a^z−2+∫μ^z dν_N(μ)}. Weak convergence ν_N⇒ϖ(μ)dμ on the fixed normalized prefix interval gives local-uniform convergence to ℬϖ. Every finite ν_N is nevertheless atomic and almost periodic vertically, so there is no uniform high-frequency finite-N lattice, and growing multiplicities require new discrete-Mellin estimates rather than inheriting T123’s O(N²) transfer. Atomic or non-Rajchman limits, scale-adaptive densities, and fully discrete strategies remain outside. No blind point is asserted to be a zeta zero, and RH remains open.',
  },
  {
    id: 'T126',
    color: ED.accent,
    status:
      'EVERY FIXED INTERIOR MEASURE · INFINITELY MANY RIGHT-HALF BLIND POINTS · RH OPEN',
    title: 'Atomic and singular fixed weights cannot remove every blind point',
    formula:
      'supp|ν|⊂[α,β]⊂⊂(1,a) ⇒ ∀c<σ*=log 2/log a, #{z: ℬν(z)=0, Re z>c}=∞',
    detail:
      'For any fixed finite complex Borel measure ν with strict interior support, no positivity or mass normalization is needed: ℬν(z)=a^z−2+∫μ^z dν(μ) has infinitely many zeros in every half-plane Re z>c with c<σ*. For a=32/21 this includes infinitely many zeros with Re z>3/2. The proof splits ν into atomic and atomless parts, uses Jessen convexity on the analytic almost-periodic atomic symbol, and then combines its positive-density almost periods with a continuous Wiener mean-square estimate and two Rouché comparisons. ' +
      'Localization depends on regularity. T125 gives one simple zero near every sufficiently high base-lattice point for an L¹ density; atomless measures, including singular-continuous ones, retain a subsequence z_{n_j}=ζ_{n_j}+o(1); a general finite complex measure gets infinitely many right-half zeros without a universal lattice or rate. Every positive atomic probability measure has positive vertical zero density in Re z>σ*+εν for some εν>0. The exact example ν=δ_{√a} factorizes ℬν=(a^(z/2)−1)(a^(z/2)+2), placing its second zero family on Re z=2σ*. ' +
      'For empirical measures converging to one fixed L¹-density target in logarithmic W₁ distance d_N, a growing lattice window transfers only under T_Nd_N→0. Cumulative rounding on prefix grids gives d_N=O(1/N+1/M_N), hence T_N=o(min{N,M_N}) is sufficient. Endpoint atoms can put every zero on Re z=0, scale-dependent measures remain outside, and the zero statement supplies neither the missing weighted Mellin error nor a zeta zero. The verifier’s δ_{√a} factorization is only a normalization fixture; the general theorem is analytic. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T127',
    color: ED.series5,
    status:
      'BOUNDED MOVING MEASURE FAMILY · COMMON RIGHT-HALF ZERO RECTANGLE · RH OPEN',
    title: 'Row-dependent interior weights cannot push every blind point away',
    formula:
      '∃R,T ∀ν [supp|ν|⊂K⊂⊂(1,a), ‖ν‖TV≤M] ∃z: ℬν(z)=0, c<Re z<R, |Im z|<T',
    detail:
      'Fix a>1, a compact K strictly inside (1,a), M<∞, and c<σ*=log 2/log a. The total-variation ball of measures supported on K is weak-* compact, and weak-* convergence there makes ℬν converge locally uniformly. T126 supplies a right-half zero for each limiting symbol; a disk around that zero, Rouché’s theorem, and a finite subcover then produce finitely many disks whose union meets every symbol zero set. One bounded rectangle c<Re z<R, |Im z|<T therefore works for the whole family. ' +
      'Every normalized positive empirical measure from arbitrary row-dependent exact integer weights on the fixed block belongs to the M=1 family, so the rectangle is independent of the row, total multiplicity, and placement of the weights. No weak convergence, Rajchman condition, denominator bound, or row regularity is required. ' +
      'This is only a uniform right-half-zero location theorem. The zero may move with the row, and the common rectangle need not meet 3/2<Re z<2: for ν=δ_{√a}, the nonzero right-half family lies on Re z=2σ*>2 when a=32/21. It gives no common zero, no fixed Mellin factor, no weighted O(N²) discrete Mellin error, no arithmetic sign, and no RH conclusion. The argument is analytic and has no separate deterministic certificate.',
  },
  {
    id: 'T128',
    color: ED.series1,
    status:
      'ONE ROUNDED STRICT-INTERIOR PREFIX · RH-EQUIVALENT · SIGN OPEN',
    title: 'A tuned moving endpoint recovers one zero-free fixed comparator',
    formula:
      'u_N=⌊105(32/21)^(2/3)N+1/2⌋;  RH ⇔ Λ₃₂,₂₁(105N,u_N)≥0 eventually',
    detail:
      'The exact prefix is the logarithm of [∏₃₃₆₀N≤v<₅₁₂₀N Kᵥ²¹ · ∏₃₃₆₀N≤v<₃₂u_N Kᵥ²¹]/[∏₂₂₀₅N≤v<₃₃₆₀N Kᵥ³² · ∏₂₂₀₅N≤v<₂₁u_N Kᵥ³²]. Replacing the nearest-integer endpoint by 105μ₀N changes its centered Vθ slack by only O(N). The resulting fixed comparator has Q₀(z)=(a^z−a)(a^z+a^(2z/3)−2). With y=a^(z/3), the second factor is (y−1)(y²+2y+2), so Q₀ has zero lines only at Re z=0, 1, and 3log 2/(2log a)=2.4683939547…; it is zero-free throughout 3/2<Re z<2. ' +
      'A dedicated 256-bit FLINT/Arb calculation evaluates μ₀ directly as the positive cube root of a², proves the exact Turing count through the first 1,000 critical zeros, and certifies δ₁₀₀₀=0.051126409956071…>1/20. Therefore RH forces a positive ≍N³ᐟ² margin, while eventual nonnegativity and Landau force RH. The finite rounded row symbols may still recover dangerous-strip zeros at extremely large heights; only the fixed comparator is used in the converse. The eventual exact product sign is not proved, so this is a simpler one-prefix equivalence—not a solution of RH.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_low_zero_annulus.c · --mu-a-two-thirds',
  },
  {
    id: 'T129',
    color: ED.brass,
    status:
      'UNCONDITIONAL NEAR-UNIT POWER-WINDOW BLOCKS · EXACT BEATTY RECURRENCE · RH OPEN',
    title: 'The tuned adaptive prefix wins deeply in every near-unit power window',
    formula:
      '∀ fixed 0<ε<B_ad, ∀Y≫1 ∃I⊂[Y,Y^θH]: ∀n∈I, Λ_n>(B_ad−ε)n³ᐟ²',
    detail:
      'The fixed T128 comparator has prime-square residue B_ad=(640/3)√5(4√42−21)(64√42−105)=727454.763559809…>724000. Landau gives limsup Λ_N/N³ᐟ²≥B_ad and, by telescoping, limsup(Λ_N₊₁−Λ_N)/√N≥3B_ad/2 unconditionally. The O(N) rounded-endpoint correction contributes a Dirichlet series holomorphic for Re v>2, while the T116 verified-height contour remains in Re v>7/3. The same moving heat therefore proves that every sufficiently large [Y,Y^θH], θH=6000350665601/6000350665597=1.0000000000006666277…, contains a whole block of ⌊√N exp(0.8√log N)⌋+1 consecutive indices with Λ_n>(B_ad−ε)n³ᐟ². The deep-index counting exponent is at least 1/(2θH)=0.4999999999996666861…. ' +
      'Exactly, α=105(32/21)^(2/3)=∛2688000=139+β with 1/25<β<1/24, so u_N advances by an aperiodic mechanical 139/140 word. The finite q-recurrence is Λ_N₊₁−Λ_N=Σ₁₆₀N^₁₆₀N₊₁₅₉q(h)+ΣᵤN^ᵤN₊₁₋₁q(h)−2Σ₁₀₅N^₁₀₅N₊₁₀₄q(h). Rigorous rational-log fixtures give both increment signs for both step letters, and exact p-adic valuations have both signs, defeating monotonicity, letter-sign, and divisibility shortcuts. A compact nonnegative asymmetric tent rewrites −D̄(x) as x{x∫h−Σ_p h(p/x)log p}, isolating one weighted prime-quadrature deficit as the remaining target. ' +
      'The result is recurrence, not a proof of RH. The heat filter suppresses hypothetical off-line modes too; H is fixed, the threshold is ineffective, and the theorem gives no additive o(N) gap, positive density, or eventual sign. A separate finite floating scan through N=800,000 observed no apparent nonpositive prefix but many long declines; it is evidence only, not an interval certificate.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py · verify_low_zero_annulus.c --mu-a-two-thirds',
  },
  {
    id: 'T130',
    color: ED.series3,
    status:
      'NATURAL-SCALE FLOOR / LOCAL DRIFT RH-EQUIVALENCE · EXACT CUBIC/TENT NO-GOS · RH OPEN',
    title: 'The missing bridge is a natural-scale floor, not another positive kernel',
    formula:
      'RH ⇔ Λ_N=O(N³ᐟ²) ⇔ Λ_N₊₁−Λ_N=O(√N log²(2N))',
    detail:
      'Each one-sided estimate Λ_N≥−CN³ᐟ² or Λ_N≤CN³ᐟ² on a tail is already equivalent to RH. More generally, a one-sided O(N^κ) estimate for 3/2≤κ<2 confines every nontrivial zero to Re ρ≤κ−1. Consequently, false RH would force liminf Λ_N/N³ᐟ²=−∞ and limsup Λ_N/N³ᐟ²=+∞. Summing the exact recurrence proves that either local direction, Λ_N₊₁−Λ_N≥−C√N log²(2N) or Λ_N₊₁−Λ_N≤C√N log²(2N), is individually RH-equivalent. ' +
      'The algebraic tuning gives an exact ξ=(32/21)^(1/3) decomposition into three nonnegative prime-jump trapezoids with weights 2,2,1. Kernel positivity is not a sign theorem: directed rational-log certificates prove S(4)>2504 and S(84)<−5991 for the shortest root buffer, with mixed exact prime valuations. Nearest-integer iteration changes the cubic orbit by only two local signed q-terms, not a contraction. ' +
      'The same rounded row is encoded by one exact nonnegative five-knot integer tent. Its square layer contributes (B_ad+o(1))N³ᐟ², and RH is equivalent to the eventual square-completed finite comparison A_N/Q₂,N≤S_N. But at N=3 the exact threshold 2^93 has only 179382 eligible upper K-factors against 179424 lower factors; Hall’s condition therefore rules out monotone equal-or-larger matching. A high-frequency off-line-mode model remains unbounded in the raw prefix while the verified moving heat suppresses it. No natural-scale floor is proved, and RH remains unresolved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T131',
    color: ED.series1,
    status:
      'LCM-COMPLETED LOCAL BALLOT · EITHER ONE-SIDED DRIFT IS RH-EQUIVALENT · RH OPEN',
    title: 'Prime-power completion isolates the zero channel in one exact row update',
    formula:
      '𝒵_N=log(𝒮_N/𝒜_N);  RH ⇔ Δ𝒵_N=O(√N log²(2N))',
    detail:
      'Complete every prime power in the T130 integer tent. Exactly, 𝒵_N=Λ_N−log 𝒬₂,N−log 𝒬≥3,N and exp(Δ𝒵_N)=𝒮_N₊₁𝒜_N/(𝒮_N𝒜_N₊₁). The same aperiodic 139/140 endpoint machine survives after replacing K_m by K̃_m=(m+1)^m/[m! lcm(1,…,m)]; its adjacent logarithmic jump is m log(1+1/m)−Λ_vM(m). Either an eventual lower or upper C√N log²(2N) bound on Δ𝒵_N is individually equivalent to RH. False RH forces the normalized completed update to be unbounded in both directions. ' +
      'The local layer sizes are now explicit. For g_N=h_N₊₁−h_N, |g_N(t)|≤685440 on 2205N<t<5120(N+1), with g_N(2205N+1)=−64 and g_N(5120(N+1)−1)=21. The cube-and-higher update is O(N¹ᐟ³). Uniformly for both Beatty letters, the square update is σ_s√N+o(√N), with σ_s>1084040. Hence the stronger sufficient-only condition Δ𝒵_N≥−10⁶√N would make ΔΛ_N≫√N, force eventual Λ_N>0, and prove RH. Equivalently, 2^(1400000⌈√N⌉)𝒮_N₊₁𝒜_N≥𝒮_N𝒜_N₊₁ eventually is sufficient. It is not claimed necessary under RH. ' +
      'After an archimedean correction whose row change is <1249000, the exact remaining obligation is one signed finite annular sum Σ_t g_N(t){Λ_vM(t)−1}. Either one-sided √N log²N bound for that von-Mangoldt quadrature is RH-equivalent. The opposite kernel edge signs explain why static positive tents do not settle it. No such eventual bound is proved, so this is a cleaner zero-channel target—not a solution of RH.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T132',
    color: ED.accent,
    status:
      'FIVE FIXED ENDPOINT BANDS · NO LETTER MULTIPLIER BLIND SPOT · RH OPEN',
    title: 'The signed row kernel collapses to five bounded-width Chebyshev-error bands',
    formula:
      '𝒬_N^loc = 64Σ_A Eψ − 32Σ_B Eψ − 74Σ_C Eψ + 21Σ_D Eψ + 21Σ_E Eψ',
    detail:
      'Exact finite Abel summation rewrites the broad T131 quadrature using only five moving endpoint bands. For the row letter s=u_N₊₁−u_N∈{139,140}, their widths are 2205, 21s, 3360, 32s, and 5120. For N≥7 the intervening plateaus of g_N are −141120, p_s∈{−47712,−47040}, q_s∈{200928,201600}, and 107520; the sole interior sign change occurs inside the 3360-site central ramp. ' +
      'For a pure explicit-formula mode Eψ(x)=x^ρ, the response on an s-row is N^ρM_s(ρ)+Oρ(N^(Re ρ−1)). With y=(32/21)^(ρ/3), M_s(ρ)=(32/105)2205^(ρ+1)(y³−1)(160y³+s y²−210). The positive root of the cubic is below 7/8, while its conjugate roots have modulus greater than (32/21)^(1/3); hence M_s has no zero for 0<Re ρ≤1. Neither the 139 nor the 140 lane can erase a hypothetical off-line zero at leading order. ' +
      'This is a fixed-ρ leading-multiplier theorem, not a finite-row strip-wide zero theorem or a sign theorem: the asymptotic is not uniform at growing height. The five band coefficients remain mixed, and multiplier nonvanishing gives neither domination of the full explicit formula nor the eventual one-sided bound required by T131. RH remains unresolved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T133',
    color: ED.series5,
    status:
      'NONNEGATIVE LOCAL-FILTER NO-GO · FIXED OFF-LINE MODES SURVIVE · RH OPEN',
    title: 'Positive local averaging cannot unsign or notch the completed row',
    formula:
      'G_N^w=Σ_jw_jg_N₊ⱼ:  G_N^w(t₋)=−64w_j₋<0<21w_j₊=G_N^w(t₊)',
    detail:
      'Let the first and last positive weights of any finite nonnegative row stencil occur at j₋ and j₊. At the first active lower edge every later row vanishes, giving −64w_j₋; at the last active upper edge every earlier row vanishes, giving 21w_j₊. Thus no such local average makes the translated kernel one-signed. For an unweighted L-row block, Σ_j<L g_N₊ⱼ=h_N₊L−h_N exactly. Once N≥7L it has the same five ramps and four plateaus, with effective letter σ=(u_N₊L−u_N)/L∈[139,140] and one central sign crossing. ' +
      'For a normalized nonnegative stencil of width H_N, the leading pure-mode multiplier is the convex letter average M_σN. Uniformly for σ∈[139,140] and 1/2≤Re ρ≤1, its normalized polynomial has the explicit positive gap 160(√a−1)(a^(1/6)−7/8)(√(3/2)−a^(1/3))², a=32/21. Hence H_N=o(N) preserves every fixed off-line x^ρ mode at natural N^(Re ρ) order. The asymptotic remains fixed-ρ, not uniform at growing height. ' +
      'Positive sublinear averaging may change the nonzero constant or phase; it does not provide an eventual arithmetic sign. Signed or mass-zero conditioning, a macroscopic window, or genuinely nonlinear/global arithmetic input lies outside this no-go. RH remains unresolved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T134',
    color: ED.series1,
    status:
      'RARE-DEFECT CURVATURE · EITHER ONE-SIDED BOUND IS RH-EQUIVALENT · RH OPEN',
    title: 'The rare 140 step isolates one RH-complete 32/21 micro-cell',
    formula:
      'δ_N=1:  C_N=𝒥(u_N+139)+R_N,  R_N=O(log N);  RH ⇔ C_N=O(√N log²(2N))',
    detail:
      'Set δ_N=s_N−139 and C_N=𝒬_N^loc−𝒬_N₋₁^loc. The δ_N=1 indices are isolated and have exact gaps 24 or 25. Splitting the long 140 blocks from a hypothetical 139 row gives, exactly, C_N=𝒥(v)+R_N with v=u_N+139. Here 𝒥(v)=21Σ_[32v,32v+32)Eψ−32Σ_[21v,21v+21)Eψ, while the five paired equal-length blocks in R_N give the unconditional bound R_N=O(log N). ' +
      'Successive defect values of v differ by only 3337 or 3476, and |𝒥(v+1)−𝒥(v)|=O(log v). Thus a one-sided √N log²N bound on C_N at the defects extends to all large v; no unsupported sparse-sampling argument is used. The consecutive primitive 𝔉(X)=21ℋ(32X)−32ℋ(21X) satisfies 𝔉(X+1)−𝔉(X)=𝒥(X). Its off-line multiplier is 672(32^ρ−21^ρ)/(ρ+1), which has no zero for Re ρ>0. The first-Riesz Landau argument therefore makes either defect lower bound or defect upper bound individually equivalent to RH. False RH forces normalized defect curvature to be unbounded in both directions. ' +
      'Since Δ²𝒵_N=−C_N plus a uniformly bounded archimedean second difference, the same criterion is an exact completed-product comparison for 𝒮_N and 𝒜_N on only the 140 rows. The contrast kernel remains mixed, so this sharper target supplies no eventual bound. RH remains unresolved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T135',
    color: ED.series3,
    status:
      'EXACT MICRO-CELL INTEGER COMPARATOR · EITHER ORIENTATION IS RH-EQUIVALENT · RH OPEN',
    title: 'One factorial/lcm comparison captures the universal 32/21 defect cell',
    formula:
      '𝒥(v)=672{ψ(32v)−ψ(21v)−11v}+R(v);  |R(v)|≤17136{1+log(32v+31)}',
    detail:
      'Let A(v)=ψ(32v)−ψ(21v)−11v. Expanding the two endpoint bands gives exactly 𝒥(v)=672A(v)+R(v), where the two triangular tails have total coefficient mass 17136 and hence |R(v)|≤17136{1+log(32v+31)}. For v≥2 the combined coefficients form one nonnegative trapezoid on q(n)=Λ(n)−1: a 32-slope rise from 21v, a plateau of height 672, and a 21-slope fall after 32v. The weights are nonnegative, but q has both signs, so this is not a sign proof. ' +
      'Put L_m=lcm(1,…,m), P_v=∏_[21v,32v)(1+1/n)^n, and D_v=11v−log P_v. Then 0<D_v<11/42. For the exact integers X_v=L_32v(21v)^(21v)(32v−1)! and Y_v=L_21v(32v)^(32v−1)(21v)!, one has log(X_v/Y_v)=A(v)+D_v. With j_v=⌈√v⌉(1+⌈log₂(2v)⌉)², each eventual statement ∃K,v₀ ∀v≥v₀, 2^(Kj_v)X_v≥Y_v or 2^(Kj_v)Y_v≥X_v is individually equivalent to RH. ' +
      'For every v≥1 the balance X_v/Y_v has negative 2-adic valuation, while a prime 21v<p<32v gives positive p-adic valuation: Nagura covers v≥2, and p=23 covers v=1. Thus neither integer ever divides the other, closing both direct-divisibility shortcuts without deciding their real order. No comparator bound is proved, and RH remains unresolved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T136',
    color: ED.series5,
    status:
      'FIXED-DEPTH COMPOSITION COLLAPSE · SAME RH-COMPLETE ORDER · RH OPEN',
    title: 'Every finite 32/21 ladder chain is one wider annulus',
    formula:
      'Σₖ<d A(21ᵏ32ᵈ⁻¹⁻ᵏv)=Eψ(32ᵈv)−Eψ(21ᵈv);  ∏ₖ<d Xᵥₖ/Yᵥₖ=X_d,v/Y_d,v',
    detail:
      'Fix d≥1 and put vₖ=21ᵏ32ᵈ⁻¹⁻ᵏv. Adjacent endpoints satisfy 21vₖ=32vₖ₊₁, so all internal Chebyshev errors and all internal lcm/product boundaries cancel exactly. The d cells become the single interval [a,b)=[21ᵈv,32ᵈv), with P_d,v=∏_[a,b)(1+1/n)ⁿ and an archimedean deficit 0<D_d,v<(d/2)log(32/21). Hence the product of the d T135 integer balances is exactly X_d,v/Y_d,v. ' +
      'For every fixed d, either eventual binary-buffered orientation is individually equivalent to RH: the pure-zero multiplier 32^(dρ)−21^(dρ) can vanish only on Re ρ=0, and the fixed d scale factor is absorbed into the comparison constant. Composition does not unlock divisibility. An exact two-adic formula makes ν₂(X_d,v/Y_d,v)<0, while Nagura for d=1 and Bertrand for d≥2 provide a prime with valuation +2. ' +
      'This rules out every fixed-depth multiplicative iteration as a simplification of T135. It proves no real order and no RH result. A depth d=d(v) growing with scale is not covered: its RH-sized error grows like 32^(d/2)√v and would require a genuinely uniform arithmetic estimate.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T137',
    color: ED.accent,
    status:
      'ADJACENT-DEPTH DECONVOLUTION · ALL THREE-DEPTH SIGNS OCCUR · RH OPEN',
    title: 'Crossing neighboring depths returns the original micro-cell',
    formula:
      'ℬ_d₊₁(v)−ℬ_d(32v)=A(21ᵈv);  (X_d₊₁,vY_d,32v)/(Y_d₊₁,vX_d,32v)=X_21ᵈv/Y_21ᵈv',
    detail:
      'Write ℬ_d(v)=Eψ(32ᵈv)−Eψ(21ᵈv). Subtracting the depth-d row evaluated at 32v from depth d+1 cancels the common top endpoint and leaves exactly A(21ᵈv); evaluating at 21v gives the symmetric upper cell A(32ᵈv). The factorial/lcm cross-products cancel identically to the corresponding T135 ratios, with no new error term. For every fixed d, either buffered orientation on either boundary sublattice is therefore individually RH-equivalent after fixed-gap interpolation. ' +
      'Depth does not provide a universal sign bootstrap. Exact directed-log enclosures with absolute margin >1/4 certify all eight signs of (ℬ₁,ℬ₂,ℬ₃) at v=1,2,3,4,5,6,12,14. This is a finite no-go, not an asymptotic oscillation claim. In addition, every nondecreasing unbounded integer depth schedule has infinitely many top-endpoint jumps by a factor greater than 32, so ordinary interpolation costs far more than the RH scale. ' +
      'A growing-depth route now needs a genuinely nonlocal coupling among overlapping annuli. Ordinary multiplication, adjacent cross-ratios, finite-depth sign persistence, and endpoint interpolation have all collapsed back to T135 or failed. No such nonlocal bound and no proof of RH is supplied.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T138',
    color: ED.accent,
    status:
      'EVERY FIXED FINITE OVERLAP IS SIGN-RECURRENT ON RH · ADAPTIVE FRONTIER OPEN',
    title: 'No fixed finite depth coupling can settle to one orientation',
    formula:
      '𝒞_c(v)=Σ_d c_dℬ_d(v)=Σ_nW_c(n/v)(Λ(n)−1);  RH ⇒ ∫₁ˣ𝒞_c(t)dt=Ω±(x³ᐟ²)',
    detail:
      'For any nonzero fixed real vector c, the same-scale overlap kernel is exactly W_c(u)=Σ_dc_d1_(21^d,32^d](u). One primitive is an exact finite combination of Vψ with Mellin multiplier M_c(s)=Σ_dc_d(32^(ds)−21^(ds)). On RH, division by x³ᐟ² leaves an absolutely convergent real mean-zero almost-periodic critical-zero wave. The finite exponential polynomial M_c has only O(T) zeros and cannot cancel the TlogT zeta zeros, so this wave is nonzero and its primitive has recurrent positive and negative x³ᐟ² excursions. ' +
      'Unit-cell variation costs only O_c(log x). Therefore 𝒞_c(v) itself must be positive and negative infinitely often on RH; either eventual sign would force a one-sided primitive contradicting those excursions. For an integer vector m, clearing signs in the exact X_d,v/Y_d,v balances gives positive integers U_m,v and V_m,v whose logarithmic ratio differs from 𝒞_m(v) by only a uniform constant. RH consequently forces both strict orders U>V and U<V infinitely often. ' +
      'This closes every fixed finite linear overlap and fixed finite product as an eventual-sign proof route. It does not rule out a two-sided critical-size estimate, coefficients changing with v, infinitely many depths with uniform control, or a genuinely nonlinear nonhomogeneous global coupling. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T139',
    color: ED.series1,
    status:
      'UNIFORMLY SUMMABLE INFINITE DEPTH IS SIGN-RECURRENT ON RH · NON-SUMMABLE FRONTIER OPEN',
    title: 'Finite arithmetic cost cannot hide the infinite critical wave',
    formula:
      'Σ_d(d+1)32^d|c_d|<∞;  M_c(s)=C(32^s)−C(21^s);  N_M(T)=O_c(T)',
    detail:
      'Let c_d be any fixed nonzero real sequence with finite uniform arithmetic cost Σ(d+1)32^d|c_d|. The infinite Λ−1 step kernel, its Chebyshev annulus sum, and its first-Riesz primitive then converge absolutely. If C(z)=Σc_dz^d, the exact Mellin multiplier is M_c(s)=C(32^s)−C(21^s). ' +
      'Vertical translates of M_c form a compact analytic hull on every closed substrip of Re s<1. No hull element is identically zero: the least active depth contributes two distinct exponential rates 32^(d₀s) and 21^(d₀s). A compactness/Jensen argument consequently bounds multiplier zeros near the critical line by O_c(T), while zeta has TlogT critical zeros on RH. The normalized primitive is therefore a nonzero mean-zero almost-periodic wave and has Ω±(x³ᐟ²) excursions. ' +
      'The same weighted norm bounds unit-cell variation by O_c(log x), forcing positive and negative values at infinitely many integer scales on RH. Integer coefficient sequences satisfying the norm are automatically finite, so a genuinely infinite exact factorial/lcm product must have growing cost or scale-dependent normalization. This closes uniformly summable infinite depth, not non-summable, adaptive, critical-size, or nonlinear coupling; RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T140',
    color: ED.brass,
    status:
      'SUBCRITICAL ADAPTIVE PROFILE DRIFT CANNOT FIX THE SIGN · CRITICAL-COST FRONTIER OPEN',
    title: 'Slow depth adaptation cannot outrun the T139 wave',
    formula:
      'Σ_(v≤X)√v(1+log(2v))²||c^[v]−c||_A=o(X³ᐟ²) ⇒ S_ad(X)=Ω±(X³ᐟ²) on RH',
    detail:
      'Let c^[v] be a row-dependent summable depth profile and c one fixed nonzero profile, with ||c||_A=Σ_d(d+1)32^d|c_d|. Under RH, |ℬ_d(v)| is bounded by √v·32^(d/2)(d+log(2v))², so the A-norm converts profile motion directly into an error in the row coupling. ' +
      'If the cumulative weighted motion through X is o(X³ᐟ²), the adaptive partial sum differs by o(X³ᐟ²) from the fixed T139 partial sum. The latter is Ω±(X³ᐟ²), hence the adaptive rows must still be positive and negative infinitely often. Pointwise convergence ||c^[v]−c||_A=o(log⁻²v) is sufficient but not required; sparse changes are allowed. ' +
      'For finite-support integer profiles the same estimate applies to the exact rowwise factorial/lcm products, because their accumulated archimedean correction is subcritical as well. Thus sparse integer edits cannot manufacture one eventual orientation unless their weighted cost reaches the critical scale. This closes slow or cumulatively subcritical adaptation, not critical-cost, non-summable, data-dependent nonlinear, or nonhomogeneous rules; RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T141',
    color: ED.series5,
    status:
      'EXACT ADAPTIVE DUAL COST · CRITICAL BUDGET NECESSARY · INDEPENDENT DIRECTION OPEN',
    title: 'The cheapest sign controller is exact—and circular',
    formula:
      'q(v)=sup_d |ℬ_d(v)|/((d+1)32^d);  cost_+(v;c)={−𝒞_c(v)}_+/q(v)',
    detail:
      'Equip depth profiles with ||c||_A=Σ_d(d+1)32^d|c_d|. Weighted ℓ¹/ℓ∞ duality makes q(v) the exact operator norm of the v-th row functional. Therefore the least profile change that turns a negative row nonnegative is exactly {−𝒞_c(v)}_+/q(v), attained by putting all correction on a depth maximizing |ℬ_d(v)|/((d+1)32^d). Under RH this maximizing depth exists because normalized responses decay exponentially with depth. ' +
      'T139 supplies positive and negative X³ᐟ² cumulative excursions. Hence any eventually nonnegative or eventually nonpositive adaptive rule must spend positive critical response budget: limsup X^(−3/2)Σ_(v≤X)q(v)||c^[v]−c||_A>0 against every fixed nonzero profile. This sharpens T140 from a coarse sufficient no-go to the intrinsic necessary cost. ' +
      'The formal optimizer can zero every row, but only by reading the exact signed Chebyshev annuli and canceling the target itself. It is a feedback identity, not an independent arithmetic proof. The surviving linear route must generate a correctly directed critical budget from separate exact structure; otherwise one must leave the linear profile class. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T142',
    color: ED.series1,
    status:
      'EVERY FIXED PERIODIC CONTROLLER IS SIGN-RECURRENT ON RH · APERIODIC STATE FRONTIER OPEN',
    title: 'Residue-class control cannot escape the critical wave',
    formula:
      'Σ_(v≤X, v≡r mod q)𝒞_c(v)=q⁻¹𝓘_c(X)+O_(c,q)(Xlog X)=Ω±(X³ᐟ²)',
    detail:
      'Fix a nonzero summable depth profile c, a modulus q, and one residue r. The O_c(log x) unit-cell variation from T139 turns one sample per q-block into a bounded-gap quadrature: its partial sum equals 1/q of the T139 primitive plus O_(c,q)(Xlog X). On RH the primitive has positive and negative X³ᐟ² excursions, so 𝒞_c(v) takes both signs infinitely often even after restricting to v≡r mod q. ' +
      'Now assign any fixed profiles c^[0],…,c^[q−1] to the q residue states. Choose one nonzero state and apply its residue theorem; the full periodic controller must take both signs. No nonzero mean assumption is used, so alternating c,−c and arbitrary zero-mean state families also fail even though their profile motion can be critical and T140 need not apply. ' +
      'Finite-support integer profiles give the same result for exact periodic factorial/lcm products: both strict orders recur on RH. Thus fixed or eventually periodic arithmetic control is closed. A surviving independent controller needs unbounded or genuinely aperiodic state, increasing periods, a non-summable depth tail, or nonlinear arithmetic input. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T143',
    color: ED.series3,
    status:
      'LOW-DISCREPANCY APERIODIC CONTROL IS SIGN-RECURRENT ON RH · CRITICAL-DISCREPANCY FRONTIER OPEN',
    title: 'Balanced aperiodic state still samples the whole wave',
    formula:
      'D_a(X)=o(√X/log X) ⇒ Σ_(v≤X)a_v𝒞_c(v)=δS_c(X)+o(X³ᐟ²)=Ω±(X³ᐟ²)',
    detail:
      'Let a_v select one fixed nonzero summable profile with positive density δ, and let D_a(X)=max_(n≤X)|Σ_(v≤n)a_v−δn|. Exact discrete Abel summation expresses the selected cumulative as δ times the T139 integer cumulative plus a discrepancy term involving only the endpoint value and adjacent row increments. ' +
      'On RH, 𝒞_c(X)=O(√Xlog²X) and 𝒞_c(v+1)−𝒞_c(v)=O(log v). Therefore D_a(X)=o(√X/log X) makes the entire selector error o(X³ᐟ²), leaving the positive and negative T139 excursions intact. Both row signs recur within that selected state. Applying this separately to each active state closes every finite-state controller satisfying the threshold, without a mean-profile assumption. ' +
      'This is genuinely aperiodic: irrational mechanical and Sturmian words have bounded discrepancy, and exact finite-support product profiles inherit the same result. A surviving state mechanism must have critical discrepancy, zero-density or unboundedly many states, changing or non-summable profiles, or nonlinear/nonhomogeneous arithmetic input. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T144',
    color: ED.series1,
    status:
      'INPUT-INDEPENDENT RANDOM CONTROL IS SIGN-RECURRENT ALMOST SURELY ON RH · FEEDBACK FRONTIER OPEN',
    title: 'Random state cannot decorrelate the critical wave',
    formula:
      'Var R_a(X)=O_c(X²log⁴X) ⇒ R_a(X)=o(X³ᐟ²) a.s. ⇒ S_(c,a)(X)=Ω±(X³ᐟ²)',
    detail:
      'Let a_v be iid Bernoulli with fixed density δ, chosen independently of the arithmetic data, and let it select one fixed nonzero summable depth profile. The centered selector error R_a(X)=Σ_(v≤X)(a_v−δ)𝒞_c(v) is a sum of independent mean-zero variables. ' +
      'On RH the pointwise bound 𝒞_c(v)=O_c(√v log²v) gives Var R_a(X)=O_c(X²log⁴X). Kolmogorov maximal inequality at dyadic cutoffs has summable failure probability at the X³ᐟ² scale; Borel–Cantelli and dyadic interpolation therefore give R_a(X)=o(X³ᐟ²) almost surely. The density-scaled T139 cumulative survives, so both row signs recur on the selected state. ' +
      'Applied state by state, the result holds simultaneously for every active nonzero profile in any finite or countable iid state law, including exact factorial/lcm products. This reaches random schedules whose typical √X discrepancy lies outside T143. Independence is essential: a selector that reads the sign of 𝒞_c(v) can retain one sign and is exactly T141’s circular feedback. Dependent or nonstationary scheduling, zero-density selection, changing/non-summable profiles, and nonlinear arithmetic input remain open; RH remains unresolved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T145',
    color: ED.accent,
    status:
      'FINITE HOMOGENEOUS MARKOV CONTROL IS SIGN-RECURRENT ON EACH ACTIVE RECURRENT CLASS · TIME-INHOMOGENEOUS FRONTIER OPEN',
    title: 'Markov dependence still cannot select one sign',
    formula:
      'S_(c,j)(X)=π_j𝓘_c(X)+o(X³ᐟ²)=Ω±(X³ᐟ²) a.s. (RH)',
    detail:
      'Let Z_v be any finite irreducible time-homogeneous Markov chain and attach one fixed summable depth profile to each state. In an aperiodic class, the transition matrix contracts its finite-dimensional mean-zero subspace exponentially. This bounds every weighted block variance by a constant times Σ𝒞_c(v)². A dyadic interval decomposition adds only log²X to the maximal second moment, and the RH pointwise bound then makes the X³ᐟ² failure probabilities summable. ' +
      'For a chain of period q, each state lives on one residue and the q-step skeleton is aperiodic. Its centered fluctuation is still o(X³ᐟ²), while T142 identifies the deterministic residue mean as π_j𝓘_c(X)+o(X³ᐟ²). Thus both critical excursions and both row signs survive almost surely. Deterministic cycles are included as zero-fluctuation skeletons. ' +
      'The result extends to arbitrary starting states and, after the finite transient phase, to each closed recurrent class of a reducible chain; exact finite-support factorial/lcm products inherit both strict orders. Ordinary dependence therefore does not help. A remaining controller must use time-dependent or arithmetic-dependent transitions, zero-density or infinite state, changing/non-summable profiles, or nonlinear input. RH remains unresolved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T146',
    color: ED.series5,
    status:
      'COMMON-LAW UNIFORMLY MIXING NONHOMOGENEOUS CONTROL IS SIGN-RECURRENT · MARGINAL-DRIFT FRONTIER OPEN',
    title: 'Changing the transition kernel is not enough',
    formula:
      '||P_u⋯P_(v−1)||₀≤Kr^(v−u) ⇒ S_(c,j)(X)=π_jS_c(X)+o(X³ᐟ²)',
    detail:
      'Let the finite-state transition matrix vary arbitrarily with the row, while every matrix preserves one positive law π. Assume only that every transition product contracts the mean-zero L²(π) subspace by Kr^(v−u) for some r<1. This is the exact uniform-mixing condition needed to retain exponential covariance decay in the nonhomogeneous chain. ' +
      'The weighted block-variance and dyadic maximal argument from T145 then applies without independent or identical transitions. On RH, each state’s centered selector error is o(X³ᐟ²) almost surely, leaving π_j times its fixed-profile T139 cumulative and therefore both critical excursions and both row signs. The result is simultaneous for all fixed profiles and extends to exact factorial/lcm products and arbitrary starting states. ' +
      'The kernels may even be chosen using deterministic arithmetic data: variation alone cannot help while the common marginal law and uniform product contraction survive. The sign-reading T141 selector escapes only by moving the state law, and long nearly absorbing epochs escape only by destroying uniform mixing. A surviving finite-state stochastic route must therefore create critical arithmetic marginal drift or mixing loss; zero-density/infinite state, changing/non-summable profiles, and nonlinear input also remain. RH is still open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T147',
    color: ED.accent,
    status:
      'ARBITRARY HISTORY-DEPENDENT RANDOMNESS REDUCES TO CRITICAL PREDICTABLE MARGINAL BUDGET · INDEPENDENT CORRELATION OPEN',
    title: 'Only the predictable marginal can carry the sign',
    formula:
      'Σ(a_v−p_v)𝒞_c(v)=o(X³ᐟ²) a.s;  P_(c,δ)(X)=Σ|p_v−δ||𝒞_c(v)|',
    detail:
      'Let a_v be any binary selector adapted to an arbitrary history and let p_v=E(a_v|F_(v−1)) be its predictable selection probability. The centered innovation Σ(a_v−p_v)𝒞_c(v) is always a martingale. On RH its quadratic variation is O_c(X²log⁴X), so Doob maximal inequality and Borel–Cantelli make it o(X³ᐟ²) almost surely—without independence, stationarity, Markov structure, or mixing. ' +
      'The selected cumulative therefore decomposes exactly into δ times the T139 wave, the predictable drift Σ(p_v−δ)𝒞_c(v), and a subcritical random error. If the absolute response budget Σ|p_v−δ||𝒞_c(v)| is o(X³ᐟ²), both critical excursions and both selected row signs survive. Conversely, eventual one-sidedness requires positive critical predictable response budget. This holds statewise for finite or countable history-dependent controllers and exact factorial/lcm products. ' +
      'The formal choice p_v=a_v=1_(𝒞_c(v)≥0) has zero martingale noise and selects one sign, but only by reading the exact Chebyshev-annulus target; it is T141 feedback in probabilistic notation. T147 does not rule out every critical-budget rule. It proves that randomness and architecture themselves contribute no critical power: a viable stochastic proof must generate a sign-aligned marginal correlation from independent arithmetic structure. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T148',
    color: ED.series3,
    status:
      'SQUAREFREE AND NONSQUAREFREE ARITHMETIC STATES ARE SIGN-RECURRENT ON RH · PRIME-CORRELATED MARGINAL FRONTIER OPEN',
    title: 'Squarefree index structure still samples the whole wave',
    formula:
      'S_sf(X)=ζ(2)⁻¹𝓘_c(X)+o(X³ᐟ²)=Ω±(X³ᐟ²)',
    detail:
      'Squarefree counting has an O(√X)-scale error, so T143’s low-discrepancy theorem does not apply. The multiplicative identity μ²(v)=Σ_(k²|v)μ(k) gives a stronger route. Uniformly in q, one q-sublattice samples q⁻¹ of the T139 primitive with O_c(Xlog X) error on RH. ' +
      'Truncate the square-divisor expansion at K=⌊log⁴(2X)⌋. The K dilation errors total O(KXlog X), while the omitted large-square divisors cost O(X³ᐟ²log²X/K) by the RH pointwise annulus bound. Both are o(X³ᐟ²), and the absolutely convergent Möbius coefficient sum is ∏_p(1−p⁻²)=1/ζ(2). Thus squarefree rows retain exactly that positive fraction of the critical wave; nonsquarefree rows retain the complementary fraction. Each state has positive and negative X³ᐟ² excursions and both row signs. ' +
      'The result applies separately to arbitrary fixed summable profiles on the two states and to exact factorial/lcm products. This is a deterministic multiplicative selector, not periodic, mechanical, or random, and it never reads the Chebyshev-annulus target. Index factorization alone therefore cannot generate T147’s critical sign alignment. A surviving arithmetic marginal needs critical divisor-tail mass, zero density, or direct correlation with primes inside the annuli. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T149',
    color: ED.brass,
    status:
      'POWER-SUMMABLE DIVISOR STATES ARE SIGN-RECURRENT ON RH · HARMONIC-BORDERLINE / PRIME-CORRELATION FRONTIER OPEN',
    title: 'Summable divisor arithmetic only rescales the wave',
    formula:
      'S_a(X)=δ_h𝓘_c(X)+o(X³ᐟ²)=Ω±(X³ᐟ²)',
    detail:
      'Let a(v)=Σ_(q|v)h(q) be a {0,1}-valued divisor-convolution state. Assume Σ_q|h(q)|q^(−1+η)<∞ for some 0<η<1 and that its density δ_h=Σ_qh(q)/q lies strictly between zero and one. Truncate the divisor expansion at Q=X^α, where 0<α<min(1,1/(2(1−η))). The T148 uniform dilation quadrature contributes O(H(Q)Xlog X), while the coefficient tail is bounded by H_ηQ^(−η) times the RH-scale wave. Both are o(X³ᐟ²). ' +
      'Consequently the selected state carries δ_h times the T139 primitive up to subcritical error, and its complement carries 1−δ_h. Both have positive and negative X³ᐟ² excursions, both contain infinitely many rows of either sign, and exact finite-support factorial/lcm products cross one in both directions. The theorem contains all r-free selectors and finite sieve states. ' +
      'This is not a claim for bare harmonic summability: a surviving divisor state may sit at that boundary, have zero density, or correlate directly with primes in the annuli. Those cases remain open, and RH remains unresolved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T150',
    color: ED.series3,
    status:
      'LOG-SQUARED HARMONIC DIVISOR STATES ARE SIGN-RECURRENT ON RH · BALANCED LOG-TAIL / PRIME-CORRELATION FRONTIER OPEN',
    title: 'Even power-borderline sieves rescale the wave',
    formula:
      '𝓛₂(h)<∞ ⇒ S_a(X)=δ_h𝓘_c(X)+o(X³ᐟ²)=Ω±(X³ᐟ²)',
    detail:
      'Write H_h(Q)=Σ_(q≤Q)|h(q)| and A_h(Q)=Σ_(q>Q)|h(q)|/q. The uncompressed divisor transfer has normalized error O(H_h(Q)log X/√X+A_h(Q)log²X). If Σ_q|h(q)|log²(2q)/q is finite, choose Q=⌊√X/log²(2X)⌋. Harmonic summability gives H_h(Q)≤QΣ|h(q)|/q, so the prefix term is O(1/log X); the logarithmic moment gives log²(2Q)A_h(Q)→0, so the tail term also vanishes. ' +
      'The selected state therefore carries δ_h times the T139 critical primitive and the complement carries 1−δ_h. Both have Ω±(X³ᐟ²) excursions, both row signs recur, and exact finite-support products cross one in both directions on RH. This is strictly stronger than T149. Let r_k be the prime with index k+⌈klog³(k+1)⌉ and select integers divisible by none of the r_k. Then r_k≈klog⁴k: the log-squared harmonic moment converges, the density Euler product is positive, but every positive power moment diverges. ' +
      'The theorem is still an RH-conditional obstruction, not the missing one-sided annular inequality. A surviving divisor mechanism must reach the balanced log-tail threshold, use zero density, or couple directly to primes inside the annuli. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T151',
    color: ED.series1,
    status:
      'β=3 SPARSE-PRIME SIEVE IS EXACTLY X³ᐟ²-CRITICAL · SIGNED PRIME-DILATION CORRELATION OPEN',
    title: 'The first critical arithmetic controller is explicit',
    formula:
      'S_a(X)/X³ᐟ²=δ₃G_c(log X)+𝔎_c(X)+o(1)',
    detail:
      'Let the forbidden primes be r_(β,k)=p_(k+⌈klog^(β−1)(k+1)⌉). Then r_(β,k)≈klog^βk, their reciprocal tail is asymptotic to 1/((β−1)log^(β−1)Q), and the full squarefree-product Euler tail has the same order. The log-squared divisor moment is finite exactly when β>3, while every finite β remains outside all T149 positive-power classes. Thus β=3 is the first exact critical boundary, not a loose exponent from the proof. ' +
      'Define the dilation error 𝒟_c(q;X)=S_c^(q)(X)−q⁻¹𝓘_c(X). Exact divisor interchange writes the selected-minus-density response as Σ_(q≤X)h_3(q)𝒟_c(q;X), up to an o(X³ᐟ²) density tail on RH. Its normalized value 𝔎_c(X) is bounded at β=3. The selected and complementary states are therefore δ₃G_c(log X)+𝔎_c(X)+o(1) and (1−δ₃)G_c(log X)−𝔎_c(X)+o(1). ' +
      'If 𝔎_c(X) tends to zero, both states retain both critical signs. Any eventual sign instead requires 𝔎_c to align with the opposite phase of the T139 almost-periodic wave on every relevant recurrence sequence. The sieve is defined only from ordinary prime indices and never reads the annular target, so such alignment would be genuinely arithmetic rather than feedback. Neither alignment nor decorrelation is proved; RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T152',
    color: ED.accent,
    status:
      'EVERY FIXED ZERO PACKET DECORRELATES FROM THE CRITICAL SIEVE · UNIFORM HIGH-ZERO RESONANCE OPEN',
    title: 'Critical alignment must escape to infinite height',
    formula:
      'Σ_(v≤X)(a₃(v)−δ₃)v^ρ=o_ρ(X³ᐟ²)  (ρ fixed)',
    detail:
      'The β=3 forbidden-prime state has natural density δ₃. Its Dirichlet series factors as ζ(s)P₃(s), where P₃(s)=∏_(r∈P₃)(1−r⁻ˢ). The reciprocal-prime sum converges, and the stronger first logarithmic moment Σ_r(log r)/r is finite. Thus P₃ is differentiable at one and ζ(s)(P₃(s)−δ₃) has a finite boundary value there: centering removes the zeta pole. ' +
      'Natural density alone gives the decisive fixed-mode statement. If E₃(X)=Σ_(v≤X)a₃(v)−δ₃X=o(X), discrete Abel summation shows Σ_(v≤X)(a₃(v)−δ₃)v^ρ=o_ρ(X³ᐟ²) for every fixed critical-line exponent ρ. Applying this termwise proves that every fixed finite packet of zeta zeros transfers with density δ₃ and contributes no limiting part of the T151 observable 𝔎_c. ' +
      'The estimate is not uniform in zero height: the Abel difference costs |ρ|, and the centered Euler product still has nonzero boundary values on 1+it. A high zero can couple to an opposite high sieve frequency even when the combined outer frequency is small. Therefore any nonzero critical alignment must escape to unbounded zero height. A uniform large-sieve or boundary-convolution estimate would force 𝔎_c=o(1), but none is proved. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T153',
    color: ED.series3,
    status:
      'EVERY NATURAL-DENSITY SELECTOR PRESERVES THE FIXED-PROFILE WAVE ON RH · ZERO/NONDENSITY/INFINITE-PROFILE FRONTIER',
    title: 'The large sieve closes the critical arithmetic controller',
    formula:
      'A(X)=δX+o(X) ⇒ Σ(a_v−δ)𝒞_c(v)=o(X³ᐟ²)',
    detail:
      'Let a_v be any bounded selector with natural mean δ and let c be any fixed finite Twin Ladder profile. On RH, truncate the explicit formula for 𝒞_c(v) at zero height X. The remainder contributes only O_c(Xlog²X), which is subcritical. Natural density and Abel summation make every fixed low-zero mode o(X³ᐟ²). ' +
      'For a dyadic packet T<|γ|≤2T, the local Riemann–von Mangoldt bound colors the ordinates into O(log T) one-separated families. Apply the multiplicative large sieve to the Dirichlet polynomial Σ_(v≤X)(a_v−δ)√v·v^(iγ). Its squared packet norm is O(log T·(X+T)X²). Cauchy–Schwarz and the 1/γ explicit-formula coefficient make the normalized packet O_c(log(2T)/√T) for T≤X. Summing dyadically and then sending the low/high split to infinity proves the centered response is o(X³ᐟ²). ' +
      'Every positive-density binary state and its complement therefore retain both critical excursions, both row signs, and both exact finite-product orders. This proves 𝔎_c(X)→0 and closes the β=3 sparse-prime controller from T151. It also implies that the circular sign-reading selector cannot possess a natural density on RH. Remaining independent routes must have zero density, fail natural density, or use a genuinely nonuniform infinite profile. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T154',
    color: ED.series1,
    status:
      'NATURAL-DENSITY SELECTORS PRESERVE EVERY UNIFORMLY SUMMABLE PROFILE ON RH · NONSUMMABLE / NONDENSITY FRONTIER',
    title: 'Natural density also survives infinite ladder depth',
    formula:
      '||c||_𝔄<∞ ⇒ Σ(a_v−δ)𝒞_c(v)=o(X³ᐟ²)',
    detail:
      'Let c=(c_d) be any fixed T139 profile with ||c||_𝔄=Σ_d(d+1)32^d|c_d|<∞. For a bounded selector with natural mean δ, write its centered response as the depth sum Σ_dc_dR_d(X). T153 gives R_d(X)=o_d(X³ᐟ²) at every fixed depth, but passing to infinitely many depths requires a uniform summable bound. ' +
      'At depth d, truncate the RH explicit formula at T_d=X32^d. The multiplier is bounded by 2·32^(d/2). Dyadic zero blocks below X have total normalized cost O(32^(d/2)); the O(d+1) blocks from X to T_d and the explicit-formula remainder enlarge this only to O(32^(d/2)(d+1)²), uniformly in X. This majorant is summable against |c_d| because (d+1)/32^(d/2) is bounded. Dominated convergence therefore proves the centered infinite-profile response is o(X³ᐟ²). ' +
      'Every positive-density binary state and its complement retain their density-scaled T139 Ω± wave and both row signs. Integer profiles in this norm automatically have finite support, so their exact product crossings were already covered. The remaining linear frontier requires zero density, no natural density, row-dependent profiles without uniform domination, or non-summable depth; nonlinear constructions also remain outside. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T155',
    color: ED.series5,
    status:
      'DOMINATED NATURAL-MEAN PROFILE SCHEDULES COLLAPSE TO THEIR MEAN ON RH · NONDENSITY / UNDOMINATED FRONTIER',
    title: 'A stable mean profile cannot steer the ladder',
    formula:
      'Cesàro c^[v]→c̄≠0 ⇒ Σ𝒞_(c^[v])(v)=Ω±(X³ᐟ²)',
    detail:
      'Let c^[v] be a row-dependent T139 profile with coordinatewise envelope g_d=sup_v|c_d^[v]| and Σ_d(d+1)32^dg_d<∞. Assume each coordinate has a natural Cesàro mean c̄_d. The envelope makes this convergence Banach-valued and places c̄ in the T139 profile space. ' +
      'Center the coefficient at every depth. T153 makes the response of each fixed centered coordinate o(X³ᐟ²). The T154 depth calculation bounds it uniformly by O(g_d32^(d/2)(d+1)²X³ᐟ²), a summable majorant under the stronger envelope norm. Dominated convergence therefore gives Σ_(v≤X)𝒞_(c^[v])(v)=𝓘_c̄(X)+o(X³ᐟ²). If c̄ is nonzero, T139 forces both critical excursions and hence both row signs. ' +
      'Finite-state schedules admit a stronger statewise conclusion. If every state has a natural density, T154 applied to its indicator shows that every positive-density state carrying a nonzero fixed profile has its own Ω± selected cumulative. Thus cancellations in a zero mean profile do not help: both row signs still occur inside that state. If all positive-density states carry the zero profile, equality holds on density one and no eventually strict comparison results. Remaining routes require failed natural state density, a missing summable envelope, non-summable depth, or a nonlinear/target-reading rule. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T156',
    color: ED.accent,
    status:
      'EVERY NONDENSITY SELECTOR HAS A MACROSCOPIC DILATION LIMIT ON RH · PHASE-LOCKED LOG-SCALE SHAPE OPEN',
    title: 'Nondensity reduces to a hydrodynamic phase lock',
    formula:
      'μ_X⇒fdu, Xⁱᵞ⇒ω_γ ⇒ X⁻³ᐟ²Σa_v𝒞_c(v)→ℋ_c(f,ω)',
    detail:
      'For any bounded selector define its dilation measure μ_X=X^(−1)Σ_(v≤X)a_vδ_(v/X) on [0,1]. These measures have uniformly bounded variation. From every scale sequence one can extract a weak limit μ and, diagonally, simultaneous limits ω_γ of every zeta phase X^(iγ). ' +
      'On RH, insert the truncated explicit formula into the selected Twin Ladder sum. Every fixed zero mode converges to ω_γ∫u^ρdμ. The multiplicative large sieve controls all modes above height T by O_c(log T/√T), uniformly in the selector and observation scale, while the explicit-formula remainder is o(X³ᐟ²). Hence every subsequential response converges to the explicit real functional ℋ_c(μ,ω)=−Σ_ρM_c(ρ)ω_γρ^(−1)∫u^ρdμ. The T154 depth majorant extends this from finite profiles to the full T139 space. ' +
      'For a binary selector, μ=f(u)du with 0≤f≤1. Natural density δ is exactly the constant profile f=δ, recovering T153–T154. If selected rows are eventually one-sided, every cluster pair generated by that selector must give the same weak sign under ℋ_c. Thus a nondensity escape must phase-lock a nonconstant macroscopic multiplicative-scale density shape to the simultaneous zeta phase. High-frequency noise cannot do it. Logarithmic block schedules can attempt this coupling, and the circular sign selector achieves it by reading the target; independent arithmetic phase locking remains open. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T157',
    color: ED.brass,
    status:
      'SMOOTH LOG-PERIODIC CONTROLLERS ARE SIGN-RECURRENT OFF A COUNTABLE ZETA-RESONANCE SET · EXCEPTIONAL BIAS OPEN',
    title: 'Only zeta-resonant log periods can bias the wave',
    formula:
      'L∉ℰ_ζ ⇒ ΣF(log v)𝒞_c(v)=Ω±(X³ᐟ²)',
    detail:
      'Take a nonzero real L-periodic weight F with Σ_k(1+|k|)|F̂_k|<∞ and modulate a fixed nonzero T139 profile by F(log v). Euler summation of each fixed zero mode and the T156 uniform high-zero tail give Σ_(v≤X)F(log v)𝒞_c(v)=X³ᐟ²H_(F,c)(log X)+o(X³ᐟ²). The absolutely convergent almost-periodic response has frequencies γ+2πk/L and coefficients −F̂_kM_c(ρ)/(ρ(ρ+1+2πik/L)). ' +
      'A frequency collision requires L=2π|m|/|γ−γ′|; a zero-frequency resonance requires L=2π|m|/|γ|. These periods form a countable measure-zero set ℰ_ζ. If L lies outside it, every active frequency is distinct and nonzero. T139 ensures M_c is nonzero at infinitely many zeros, so H is nonzero, while its Bohr mean is zero. Almost-periodic recurrence forces both X³ᐟ² excursions and both modulated row signs. ' +
      'At an exceptional period the constant coefficient is explicit: −(2/3)Σ_(γ+2πk/L=0)F̂_kM_c(ρ)/ρ. Resonance is only necessary; this bias must still dominate the full off-resonant spectrum to yield one sign. Thus the first smooth nondensity design target is exact zeta resonance, not arbitrary logarithmic blocking. Discontinuous binary blocks, exceptional periods, and nonlinear target-reading rules remain open. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T158',
    color: ED.series3,
    status:
      'EXACT BINARY LOG BLOCKS ARE SIGN-RECURRENT OFF THE ZETA-RESONANCE SET · EXCEPTIONAL BLOCK BIAS OPEN',
    title: 'Sharp logarithmic blocks do not evade generic recurrence',
    formula:
      'L∉ℰ_ζ ⇒ selected and complement = Ω±(X³ᐟ²)',
    detail:
      'Let F be any real L-periodic bounded-variation weight. This includes an exact half-open binary block F=1_I on any nonempty proper finite union of log-phase intervals. Its Fourier coefficients satisfy |F̂_k|≤Var(F)/(2π|k|). ' +
      'For each zero mode, replace the smooth Fourier Euler step by the periodic exponential resolvent Q_(ρ,F)(t)=∫_0^∞F(t−y)e^(−(ρ+1)y)dy. Summation across geometric periods gives Σ_(v≤X)F(log v)v^ρ=X^(ρ+1)Q_(ρ,F)(log X)+O(X¹ᐟ²), including every jump. The shifted zero kernel is O(log²(2+|λ|)/(1+|λ|)); combined with the 1/|k| Fourier decay, the complete double response remains absolutely and uniformly convergent. ' +
      'Therefore the T157 almost-periodic formula holds unchanged. Outside ℰ_ζ its frequencies are distinct and nonzero, so every nonzero BV weight has a nonzero mean-zero response. For a nontrivial binary block, both F and 1−F qualify: selected and complementary rows each retain Ω± critical excursions, both row signs, and both exact factorial/lcm product orders. Discontinuity, endpoint convention, and arbitrarily sharp block boundaries do not help. Only an exceptional zeta-resonant period whose constant bias dominates the full off-resonant spectrum remains in the fixed-period binary route. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T159',
    color: ED.brass,
    status:
      'EXACT RESONANT BIAS DERIVED · FIVE-DEPTH FIRST-ZERO CANDIDATE CROSSED AT 1,000 ZEROS · TAIL / OPTIMIZATION OPEN',
    title: 'The first resonant block almost works, then breaks',
    formula:
      'max|B_(j,m)|=(4/3)|sin(πmδ)|/(πm)·|M_c(ρ_j)/ρ_j|',
    detail:
      'For one interval of duty δ in a log period L, F̂_k=e^(−iλ_k(θ+δL/2))sin(πkδ)/(πk). If L=2πm/γ_j, the positive and negative j-th zero modes meet at frequency zero and create B_(j,m)=−(4/3)Re(F̂_(−m)M_c(ρ_j)/ρ_j). Optimizing the interval phase gives the displayed sharp magnitude. The strongest first harmonic uses m=1 and half duty. ' +
      'The first co-design set L=2π/γ_1 and chose a five-depth real profile with |M_c(ρ_1)|=1 while numerically canceling M_c(ρ_2) and M_c(ρ_3). The phase was chosen for positive maximal first-zero bias. Using the exact periodic resolvent, the deterministic exploratory scanner observed minima +3.50×10^(−3) for 100 zeros/500,001 phases and +1.25×10^(−3) for 300 zeros/800,001 phases. At 1,000 zeros and 1,200,001 phases it found a negative sample, −3.27×10^(−4). ' +
      'This is finite double-precision exploration, not an interval certificate. The 1,000-zero crossing falsifies this particular candidate before the omitted infinite tail is considered. The constructive frontier is now precise: jointly optimize the resonant block and Twin Ladder multiplier across growing packets, prove an infinite-tail bound below the constant bias, then transfer cumulative positivity to every row. The scanner lives beside the deterministic certificate and labels its finite scope explicitly. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/scan_resonant_log_block.py',
  },
  {
    id: 'T160',
    color: ED.series3,
    status:
      'EXACT RESONANT-PAIR POSITIVITY · DEPTH-9 RAYLEIGH LEAD SURVIVES 1,000-ZERO FINITE STRESS · TAIL / ROW TRANSFER OPEN',
    title: 'The resonant pair is positive; optimize everything else',
    formula:
      'h_(ρ₁,c)(t)>(149/50)|M_c(ρ₁)/ρ₁|γ₁/(γ₁²+9/4)',
    detail:
      'For the half-duty block with L=2π/γ_1 and the T159 optimal phase, set q_γ(x)=e^(iγx)Q_(ρ,F)(x). Its exact two-piece resolvent obeys q_γ′+(3/2)q_γ=e^(iγx)F(x). The imaginary part is strictly positive through both half-periods. The certified γ_1>14.13 bound makes the displayed lower margin rigorous, so the complete resonant conjugate pair—not only its constant Fourier coefficient—is pointwise positive. The sharper design condition charges only the other zero pairs. ' +
      'After exact shifted-frequency collision grouping, Bohr Parseval gives Mean|R|²=cᵀQ_neρc and |M_c(ρ_1)/ρ_1|²=cᵀP_ρc. Thus the finite-depth RMS design is the generalized eigenproblem λ_max(P_ρ,Q_neρ). A depth-nine profile independently optimized on 100, 300, and 1,000 positive-zero packets produced finite ratios 1012.5, 1007.6, and 1007.2, with sampled full-response minima +0.01698, +0.01655, and +0.01573. At 1,000 zeros the sampled other-zero residual sup was 0.01072, below the 0.01474 analytic pair lower bound evaluated from the floating inputs. ' +
      'This is a materially stronger candidate than T159, but not a certificate or RH proof. The zeros and profile are floating point, the phase samples are finite, the Fourier optimizer is truncated, no uniform residual enclosure or infinite-zero tail bound exists, and cumulative positivity has not been transferred to every row. Those are now the explicit proof obligations. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/scan_resonant_log_block.py',
  },
  {
    id: 'T161',
    color: ED.series3,
    status:
      'RIGOROUS RH-CONDITIONAL COMPLETE RESPONSE · 10,000-ZERO ARB / TURING / HADAMARD CERTIFICATE · UNCONDITIONAL AGGREGATE OPEN',
    title: 'The exceptional block response is positive—including its infinite tail',
    formula:
      'RH ⇒ min_t H_(F,c†)(t)>0.00092497785698634539',
    detail:
      'At a fixed local position x in the half-duty logarithmic block, the j-th nonresonant conjugate pair has magnitude at most 2|M_c(ρ_j)/ρ_j||Q_(ρ_j,F)(x)|. Summing these magnitudes gives a one-dimensional envelope that permits every other zero pair to align independently, so no linear-independence or random-phase assumption is used. The exact two-piece resolvent gives |Q_j′|≤|1+e^(−(ρ_j+1)L/2)|^(−1), producing a rigorous cyclic Lipschitz correction between phase-cell centers. ' +
      'For all omitted zeros, |M_c(ρ)| is bounded by the exact depth-profile ℓ¹ norm and |Q| by a half-block resolvent constant. The residual Hadamard identity then charges the entire infinite tail at once. With exact terminating-decimal profile coefficients, 256-bit balls, 10,000 critical zeros, 1,001 cyclic cells, and an independent Turing count through height 9878.2187…, the certificate encloses the mesh cost as 0.00111217, the complete omitted-zero charge as 0.00210940, and the final worst lower endpoint above 0.0009249778. ' +
      'Therefore RH rigorously implies an eventual positive X^(3/2)-scale cumulative response and, after clearing denominators, an exact aggregate factorial/lcm product order over the selected rows. This is the first certified one-sided exceptional-block response, but it is not a proof of RH: the calculation assumes RH for the critical-line explicit formula and Hadamard tail, the aggregate product inequality has no unconditional arithmetic proof, its converse is unknown, and individual rows are not eventually controlled. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_resonant_phase_envelope.c',
  },
  {
    id: 'T162',
    color: ED.series3,
    status:
      'RIGOROUS TWO-PROFILE RH-CONDITIONAL RESPONSE · NO COMMON MULTIPLIER ZERO IN THE CRITICAL STRIP · FREQUENCY CONVERSE OPEN',
    title: 'Two positive profiles remove the multiplier blind spot',
    formula:
      'RH ⇒ min_t H_(F,c±)(t)>0.00071085254508616933',
    detail:
      'The original T161 multiplier is not globally zero-detecting. A separate 384-bit Arb/Rouché certificate proves exactly one zero of M_(c†) in the radius-10^(−30) disk centered at 0.562265984033223878…+9924.926871939817910…i. The disk lies strictly to the right of Re s=1/2 and above the T161 10,000-zero Turing height. It certifies a multiplier zero, not a zeta zero, but proves that one aggregate observable has a genuine spectral blind location. ' +
      'Set c±=c†±10^(−4)e₁ exactly. On RH, the complete depth-one response is at most (√32+√21)C_L(2+γ_E−log(4π))<2.1412531191. The extended 256-bit phase-envelope certificate charges each perturbation by less than 0.000214125312, leaving a uniform lower endpoint above 0.000710852545 for both profiles, including all zeros and every block phase. Thus RH implies two eventual aggregate factorial/lcm product orders with a 0.0007X^(3/2) margin. ' +
      'The pair has no common multiplier zero in 0<Re s<1: M_(c+)−M_(c−)=2·10^(−4)(32^s−21^s), and equality of 32^s and 21^s would force Re s=0 by absolute values. This removes multiplier blindness from a prospective joint converse. It is still not RH: neither aggregate inequality is proved arithmetically, and exceptional shifted-frequency resonance, collisions, and a possible nonattained right edge remain uncontrolled. Individual row signs also remain open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_multiplier_blind_spot.c + verify_resonant_phase_envelope.c',
  },
  {
    id: 'T163',
    color: ED.series1,
    status:
      'UNCONDITIONAL ZERO EXPANSION · ISOLATED FINITE RIGHT-EDGE LANDAU REDUCTION · EXACT RESONANCE / INFINITE EDGE OPEN',
    title: 'The remaining frequency escape is now exact',
    formula:
      'two T162 orders + isolated finite false edge ⇒ odd resonance or γ-collision mod γ₁',
    detail:
      'The RH-conditional T158 asymptotic can be replaced by an unconditional formula. Insert the absolutely convergent first-Riesz explicit formula into the exact Twin Ladder primitive, integrate against the binary log block, and transfer back to integer rows. For every fixed finite profile, S_(F,c)(X)=−Σ_ρm_ρM_c(ρ)ρ^(−1)X^(ρ+1)Q_(ρ,F)(log X)+O_(F,c)(Xlog(2X)). The complete zero sum converges absolutely at each X because |M_c(ρ)| is uniformly bounded in the critical strip, |Q|≪|ρ+1|^(−1), and Σ_ρ1/(|ρ||ρ+1|) converges. No RH assumption enters this expansion. ' +
      'For the translated half-duty controller, F̂_0=1/2 and F̂_k=e^(−ikγ₁(θ+L/4))sin(πk/2)/(πk). Thus only k=0 and odd k occur. A real shifted singularity above the RH line can come only from a zero whose ordinate is an odd multiple of γ₁. Two shifted zero terms can collide only when their ordinates differ by an integer multiple of γ₁; the exact combined residue is a finite multiplier-weighted collision sum. The O(Xlog X) transfer is Mellin-holomorphic for Re z>1 and cannot cancel either obstruction. ' +
      'Assume the two exact T162 aggregate product orders are eventually true and a false-RH right edge β*>1/2 is attained with only finitely many zeros in a left neighborhood. If neither resonance relation occurs at that edge, every shifted class is a nonreal singleton. T162 makes at least one profile see it. Its nonnegative aggregate slack then has Mellin abscissa 1+β*, so Pringsheim–Landau requires a real singularity there, while the exact odd-harmonic classification makes the transform regular—a contradiction. This excludes every nonresonant isolated finite counterconfiguration. It is still not RH: neither arithmetic order is proved, collisions may cancel, and an infinite or nonattained right edge may accumulate shifted singularities.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T164',
    color: ED.series5,
    status:
      'CONDITIONAL GLOBAL RIGHT-EDGE DICHOTOMY · JOINT COLLISION SHIELD OR ASYMPTOTIC ODD RESONANCE · BOTH EXCEPTIONS OPEN',
    title: 'Every infinite right-edge escape must shield or resonate',
    formula:
      'two T162 orders + ¬RH ⇒ joint shield or β_n→β*, dist(γ_n,(2ℤ+1)γ₁)→0',
    detail:
      'Group every shifted collision point by its exact two-profile residue vector R(z₀)=(R_(c+)(z₀),R_(c−)(z₀)). A singleton class is always jointly visible because the T162 multipliers have no common critical-strip zero. Hence the uncanceled divisor can stop a fixed distance left of β*=sup_ρ Re ρ only if every class generated by zeros in a full top strip contains an exact ordinate collision and cancels simultaneously for both profiles. This is the joint collision shield; no independence of its two complex cancellation equations is assumed. ' +
      'If no such shield exists, uncanceled shifted singularities approach Re z=1+β*. One of the two nonnegative aggregate slacks then has Mellin abscissa 1+β*. Pringsheim–Landau forces a singularity at the real boundary point. Split the zero sum below β*−ε and write the remaining response period by period: on every compact set separated from the shifted divisor, its terms have a summable O(|ρ|^(−2)) majorant, so the transform converges normally there. The required real singularity must therefore be approached by actual uncanceled shifted points. ' +
      'Consequently there are zeros ρ_n=β_n+iγ_n and active half-duty indices k_n with β_n→β* and γ_n+k_nγ₁→0. Since nontrivial zero ordinates stay away from zero, the escaping indices are odd apart from a repeated exact resonance, giving dist(γ_n,(2ℤ+1)γ₁)→0. This closes the generic infinite-edge loophole but is still not RH: both aggregate product inequalities are unproved, and neither the exact joint collision shield nor the asymptotic Diophantine resonance has been excluded.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T165',
    color: ED.accent,
    status:
      'EXACT TWO-PERIOD NO-GAIN THEOREM · IRRATIONAL ODD LATTICES ASYMPTOTICALLY MEET · SAME-ZERO COUPLING OPEN',
    title: 'A second fixed period does not separate the Landau escape',
    formula:
      'Δ(H_a,H_b)>0 ⇔ a/b=p/q reduced with p,q of opposite parity',
    detail:
      'For H_a=(2ℤ+1)a define Δ(a,b)=inf{|u−v|:u∈H_a,v∈H_b}. If a/b is irrational, the odd orbit (2n+1)a/b modulo 2 is dense and approaches the odd residue class, so odd multiples of a and b come arbitrarily close at unbounded height. If a/b=p/q is reduced with p and q both odd, the lattices intersect exactly. Only opposite parity gives a positive gap: writing a=pd and b=qd, parity makes every difference a nonzero odd multiple of d, and a parity-adjusted Bézout solution attains d. ' +
      'This already invalidates the idea that an incommensurate second half-duty period has no common asymptotic harmonic lattice. There is a second logical obstruction: T164 applied to two separately nonnegative controller slacks need not select the same zeta zeros. One right-edge subsequence may approach H_a and another may approach H_b, so even the exceptional positive-gap case is not contradictory. ' +
      'The result prevents an expensive second Arb certificate from being confused with an RH converse. A useful next construction must force the same right-edge zeros to be visible across controllers, derive a quantitative approximation rate incompatible with zero ordinates, chirp or otherwise vary the frequency set with scale, or rule out the joint collision shield directly. Neither T162 product order is proved, and RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T166',
    color: ED.series3,
    status:
      'COUNTABLE RH-POSITIVE DEPTH PROBES · EVERY FIXED COLLISION CLASS DETECTED · UNBOUNDED-MULTIPLICITY DIAGONAL SHIELD OPEN',
    title: 'Depth moments break every fixed collision shield',
    formula:
      '|J|=m ⇒ some d≤2m−1 has R_(e_d)(z₀)≠0',
    detail:
      'Extend the exact T161 profile by zeros, retain the base c^(0)=c†, and set c^(d)=c†+10^(−6)64^(−d)e_d. On RH the full depth-d response is bounded by B_d≤32^((d−1)/2)B₁. The perturbation cost is therefore at most B₁/(64·10⁶)<3.346875×10^(−8), uniformly in d, and the certified response remains above 0.00092494 for every member of this countable rational family. The base and each probe have an eventual 0.0009X^(3/2) aggregate order on RH, though none is proved arithmetically. ' +
      'At a shifted collision point, cancellation for the base and depth-d probe forces their difference Σ_ja_j(32^(dρ_j)−21^(dρ_j))=0. For an m-term class this is the vanishing of moments 1,…,2m−1 of a signed measure on at most 2m nodes; moment zero vanishes automatically. The two base circles are disjoint, and at least one phase map is injective because γ₁log32/(2π) and γ₁log21/(2π) cannot both be rational—otherwise log32/log21 would be rational, contradicting unique factorization. Vandermonde uniqueness therefore forces all residue weights to vanish, which is impossible. ' +
      'For an infinite class, the collision weights are absolutely summable. If every depth moment vanished, the 32-circle Fourier coefficients would decay exponentially relative to the 21-circle coefficients. Removing the corresponding analytic density and applying F. and M. Riesz makes the atomic measures absolutely continuous and hence zero; injectivity again contradicts nonzero residues. Thus every fixed class is visible at some finite depth. A nonattained edge can still diagonalize through collision classes whose multiplicities grow without bound while progressively more depths cancel. Proving the countable arithmetic orders or excluding that diagonal shield remains open; RH is not proved.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T167',
    color: ED.brass,
    status:
      'GENERIC TWO-PROFILE COLLISION DETECTION · UNIFORM RH-POSITIVE PATH · PARAMETER / FINITE-PRODUCT / MOVING-EDGE MARGIN OPEN',
    title: 'One geometric profile generically detects every fixed collision',
    formula:
      'a.e. t∈(0,1): (R_(c†)(C),R_(c(t))(C))≠(0,0) for every fixed C',
    detail:
      'Set c(t)=c†+10^(−6)Σ_(d≥1)(t/64)^de_d. The profile norm is uniformly summable for 0≤t≤1. Summing the T166 response bounds geometrically gives ||H_(F,c(t)−c†)||∞<10^(−6)B₁/58<3.6932×10^(−8), so the entire compact path retains the certified RH-conditional lower margin 0.00092494. ' +
      'The geometric depth series has the exact multiplier increment M_(c(t)−c†)(s)=64·10^(−6)t(32^s−21^s)/((64−t32^s)(64−t21^s)). Its denominators cannot vanish in the open critical strip for 0<t≤1, and its numerator vanishes there only if 32^s=21^s, which would force Re s=0. Thus the base and every nontrivial path profile have no common multiplier zero. ' +
      'For a fixed shifted collision class C, the residue difference Φ_C(t)=R_(c(t))(C)−R_(c†)(C) is analytic on a disk larger than the unit disk. T166 proves that at least one Taylor coefficient R_(e_d)(C) is nonzero, so Φ_C is not identically zero and its exceptional real parameters are discrete. For an m-term class, Φ_C is rational with numerator degree at most 2m−1, so any 2m distinct nonzero samples include a detecting value. There are only countably many collision classes; the union of all exceptional sets is therefore countable and null. Almost every single t pairs with the base to detect every fixed class simultaneously. ' +
      'This is an analytic two-profile compression, not RH. The good parameter is nonconstructive and may not be rational, c(t) has infinite depth and no denominator-cleared finite factorial/lcm product, and neither aggregate inequality is proved unconditionally. Exact simultaneous visibility already removes a collision shield even if residue sizes tend to zero; the half-duty controller’s asymptotic odd resonance remains. T168 replaces both the infinite profile and infinite Fourier support by finite families.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T168',
    color: ED.series1,
    status:
      'PROVED SIX-PROFILE RH CRITERION · FINITE FOURIER SUPPORT · SIX ARITHMETIC ORDERS OPEN · FIRST-ZERO-TUNED',
    title: 'A finite-spectrum controller removes both analytic escapes',
    formula:
      'RH ⇔ ∀d=0,…,5: S_(G,c^(d))(X)>0.0003X^(3/2) eventually',
    detail:
      'Replace the half-duty block by the smooth nonnegative controller G_θ(t)=(1+cos(γ₁(t−θ)))/2. Its Fourier support is exactly {−1,0,1}; choose θ so the k=−1 mode of the first conjugate zero pair is positive. A 256-bit Arb certificate encloses the first 10,000 critical-line zeros, proves their completeness by a Turing count, bounds the first pair from below, charges every other enclosed pair termwise, and charges the full omitted Hadamard tail. It proves min_t H_(G,c†)(t)>0.000375507134470647016 on RH. ' +
      'For c^(d)=c†+10^(−6)64^(−d)e_d, the complete scalar three-mode response makes the depth-one perturbation cost less than 1.1122454601×10^(−8); later depths cost less. Thus the base and five exact finite probes all retain 0.000375496012016046695. Every shifted collision class now has at most three distinct zero terms. If all six residues vanished, subtracting the base would eliminate moments d=1,…,5, contradicting the T166 depth bound d≤2m−1. No joint collision shield survives. ' +
      'If the six eventual weighted aggregate inequalities hold, the vector-valued Landau argument has only its resonance branch left. Finite Fourier support forces γ_n+k_nγ₁→0 with k_n∈{−1,0,1}; bounded ordinates make a subsequence an exact resonance. The completed 10,000-zero count excludes any off-line zero at 0 or ±γ₁. This proves the displayed equivalence, not RH: none of the six aggregate inequalities is known unconditionally, and both γ₁ and θ are taken from the certified first zeta zero rather than from a zero-independent prime construction.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_resonant_phase_envelope.c',
  },
  {
    id: 'T169',
    color: ED.series5,
    status:
      'PROVED THREE-DEPTH COLLISION SEPARATION · FOUR-INEQUALITY RH CRITERION · ARITHMETIC ORDERS OPEN',
    title: 'Three depths already separate every finite-spectrum collision',
    formula:
      'RH ⇔ ∀d=0,1,2,3: S_(G,c^(d))(X)>0.0003X^(3/2) eventually',
    detail:
      'For the T168 shifts k∈{−1,0,1}, write ρ_k=ρ−ikγ₁, a=e^(−iγ₁log32), b=e^(−iγ₁log21), and r=(32/21)^ρ. After removing 21^(dρ), the depth-d moment in column k is (ra^k)^d−(b^k)^d. The determinant with rows d=1,2,3 factors as Π_(k=−1)^1(ra^k−b^k)Q(r). The three linear roots lie on |r|=1. ' +
      'A new 256-bit FLINT/Arb certificate constructs the cubic Q directly from the certified first zero and applies the strict Schur recursion. Its three leading-minus-constant modulus margins are 1.3687787580127637449, 3.1075604640523260467, and 0.3951335020560075122. Schur–Cohn therefore places every zero of Q in |r|<1. For every nontrivial zero parameter with Re ρ>0, |r|=(32/21)^(Re ρ)>1, so neither Q nor a linear factor can vanish. The three moment columns—and every subfamily—are linearly independent. ' +
      'Depths one through three consequently detect every finite-spectrum collision, replacing the generic T166 depth bound through five. Combining this with T168 gives the displayed four-profile equivalence. This is a strict reduction of the controller ledger from six unproved orders to four, not a strict reduction of RH: all four inequalities remain unproved, and the controller still reads the certified first zeta zero.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_three_depth_collision_determinant.c',
  },
  {
    id: 'T170',
    color: ED.series3,
    status:
      'GENERIC SINGLE FINITE-PROFILE RH CRITERION · FULL-MEASURE PARAMETER SET · EXPLICIT PARAMETER OPEN',
    title: 'One generic finite profile carries the whole criterion',
    formula:
      'a.e. u∈[−1,1]³: RH ⇔ S_(G,c(u))(X)>0.0003X^(3/2) eventually',
    detail:
      'Mix the three T169 directions into c(u)=c†+10^(−6)Σ_(d=1)^3 64^(−d)u_de_d. The complete critical-line perturbation costs at most the depth-one budget times 1+q+q², where q=√32/64. The updated 256-bit interval certificate gives a cube cost below 1.2192444161×10^(−8) and proves min_t H_(G,c(u))(t)>0.000375494942026486214 uniformly for every u∈[−1,1]³ on RH. ' +
      'For any shifted collision class C, its residue is affine in u. T169 proves that the coefficient vector (R_(e₁)(C),R_(e₂)(C),R_(e₃)(C)) is nonzero, so the parameters canceling C form a proper real-affine subspace of the cube, of measure zero. Zeta zeros and the three Fourier shifts generate only countably many classes; outside their null union, one profile sees every class simultaneously. The scalar Landau converse then has no collision shield, while bounded three-mode resonance is excluded by the same completed 10,000-zero Turing count as T168. ' +
      'This proves the displayed equivalence for a full-measure set of parameters, not RH. It does not exhibit a certified rational or algebraic u; the good set depends on the actual collision classes. The one eventual arithmetic inequality remains unproved, and G still uses the certified first zero in its frequency and phase.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_resonant_phase_envelope.c',
  },
  {
    id: 'T171',
    color: ED.brass,
    status:
      'ONE-PARAMETER FINITE-PROFILE RH CRITERION · COUNTABLE EXCEPTIONAL SET · EFFECTIVE PARAMETER OPEN',
    title: 'A cubic path leaves only countably many bad parameters',
    formula:
      '∀t∈[0,1]∖E: RH ⇔ S_(G,c★(t))(X)>0.0003X^(3/2) eventually, |E|≤ℵ₀',
    detail:
      'Restrict the T170 cube to c★(t)=c†+10^(−6)Σ_(d=1)^3 64^(−d)t^de_d. The path u=(t,t²,t³) stays inside [−1,1]³, so the entire interval inherits the certified RH-conditional lower margin 0.000375494942026486214. ' +
      'For a fixed shifted collision class C, the residue R_(c★(t))(C) is a complex polynomial of degree at most three. T169 says its three positive-degree coefficients cannot all vanish, so it is nonconstant and has at most three roots. Since there are only countably many collision classes, their real root sets have a countable union E. Every t outside E sees every class; the T170 Landau and compact-resonance argument then gives the displayed one-profile equivalence. ' +
      'This is a stronger genericity statement, not an explicit controller or a proof of RH. The countable set E could contain every rational or algebraic point, so no exact good t is certified. The one eventual arithmetic inequality is unproved, and the frequency and phase still use the first zeta zero. Effective avoidance of E is now the precise derandomization problem.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_first_radix.py',
  },
  {
    id: 'T172',
    color: ED.accent,
    status:
      'UNIFORM MULTIPLIER BLIND-SPOT NO-GO · ENTIRE POSITIVE CUBE · NOT A ZETA ZERO',
    title: 'Every profile in the positive cube retains a blind location',
    formula:
      '∀u∈[−1,1]³: ∃!s, |s−s₀|<10^(−6), M_(c(u))(s)=0, 1/2<Re s<1',
    detail:
      'Use the certified T162 multiplier-zero center s₀=0.5622659840332+9924.9268719398i and compare every T170 multiplier with M_(c†)′(s₀)(s−s₀). On the radius-10^(−6) disk, a 384-bit FLINT/Arb certificate bounds the complete perturbation 10^(−6)Σ_(d=1)^3 64^(−d)u_d(32^(ds)−21^(ds)) by 2.177131667910347866×10^(−7). Adding the base center value and Taylor remainder gives less than 2.199393376973256903×10^(−7), while the linear reference is greater than 1.697632526281556068×10^(−5). Rouché therefore gives exactly one multiplier zero in the disk for every cube point, including the entire T171 cubic path. ' +
      'This is a structural no-go for one derandomization strategy, not evidence of an off-line zeta zero and not a refutation of T170/T171. The disk is above the completed 10,000-zero Turing height, and the certificate concerns M_c rather than ζ. Almost every parameter still avoids all actual zeta collision classes. What fails is the stronger plan of selecting t by proving M_(c★(t)) zero-free throughout the strip. A successful explicit choice must prove noncoincidence with the actual zeta divisor, move to another RH-positive profile component, or establish the weighted arithmetic inequality directly.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_multiplier_blind_spot.c',
  },
  {
    id: 'T173',
    color: ED.series3,
    status:
      'EXACT DEPTH-12 POSITIVE ESCAPE · KNOWN BLIND BRANCH LEFT OF CRITICAL LINE · T174 TESTS GLOBAL CENSUS',
    title: 'A larger positive path escapes the known blind branch',
    formula:
      'min H_(G♯,c♯)>0.0003216790 on RH; tracked M_(c♯) root has Re s<1/2',
    detail:
      'Set α=41/200 and take the exact rational depth-12 profile c♯=4{(1−α)c†−αq₁₂e₁₂}, with q₁₂=8.814659377234676…×10^(−10) represented by the terminating decimal in the proof. Retune only the phase of the same nonnegative three-mode controller. A 256-bit scan encloses the first 10,000 critical-line zeros, independently repeats their Turing count, charges every enclosed nonresonant pair, and charges the complete omitted Hadamard tail. Before scaling, the complete margin is above 8.041975638059209×10^(−5); scaling by four proves min H_(G♯,c♯)>0.000321679025522368361>0.0003 on RH. ' +
      'A separate 512-bit Rouché certificate follows the T162/T172 multiplier branch to s♯=0.49998559984461965+9924.936716166368i. On the radius-10^(−10) disk, the Taylor remainder is below 2.0032689573×10^(−17), versus a linear boundary magnitude above 2.6339690576×10^(−9), and the whole disk lies left of Re s=1/2. Thus the exact profile simultaneously retains the target positive response and removes the one known off-line blind branch. ' +
      'This is a constructive escape from T172’s local cube, not a proof that M_(c♯) is globally zero-free. Other exponential-polynomial zeros may remain in the critical strip, and a single explicit profile may still cancel shifted multi-zero collision classes. The weighted aggregate is a rigorous RH consequence but is not proved unconditionally and is not yet an RH equivalence. T174 performs the global-zero-free stress and finds a rigorous low blind spot.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/scan_alternative_finite_fourier_profiles.c + verify_depth12_escape.c',
  },
  {
    id: 'T174',
    color: ED.accent,
    status:
      'RIGOROUS LOW MULTIPLIER BLIND SPOT · GLOBAL ZERO-FREE ESCAPE CLOSED · NOT A ZETA ZERO',
    title: 'The depth-12 profile is not globally multiplier-zero-free',
    formula:
      '∃!s: |s−s_low|<10^(−12), M_(c♯)(s)=0, 1/2<Re s<1, 0<Im s<14',
    detail:
      'Use the exact T173 coefficients and center s_low=0.560849641973665926+1.245234457460175125i. A new 512-bit FLINT/Arb certificate bounds |M_(c♯)(s_low)| below 1.23×10^(−103), |M_(c♯)′(s_low)| above 124.0720378378863125, and the second derivative throughout the radius-10^(−12) disk below 31232.388068119852. The center residual plus Taylor remainder is below 1.561619403405993×10^(−20), versus a linear boundary magnitude above 1.240720378378863×10^(−10). Rouché therefore proves exactly one multiplier zero in the disk. ' +
      'The interval geometry places the entire disk inside 1/2<Re s<1 and 0<Im s<14. The completed first-zero/Turing ledger used by T168 and T173 begins above 14.1347251417, so the certified point is not a nontrivial zeta zero and is not evidence against RH. It rigorously refutes only the stronger plan of proving M_(c♯) zero-free everywhere in the critical strip. ' +
      'The generic one-profile criterion survives because it needs the multiplier to avoid actual zeta collision classes, not every point of the strip. The constructive frontier is now an explicit proof of zeta-divisor noncoincidence, a paired-profile separation mechanism, or a direct unconditional proof of the eventual weighted arithmetic order. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_depth12_low_blind_spot.c',
  },
  {
    id: 'T175',
    color: ED.brass,
    status:
      'EXACT DILATION-ALIGNED NO-GAIN · TURING-CERTIFIED NONRESONANCE · RH RESPONSE Ω±',
    title: 'Endpoint periodicity removes the resonant bias',
    formula:
      'LΔ=log(32/21), GΔ(log(32^d x))=GΔ(log(21^d x)); S_(GΔ,c♯)=Ω±(X³ᐟ²) on RH',
    detail:
      'Choose the nonnegative three-mode controller G_(Δ,θ)(t)=(1+cos(ωΔ(t−θ)))/2 with ωΔ=2π/log(32/21). Its period is exactly the log gap between paired Twin Ladder endpoints, so its weights agree at 32^d x and 21^d x for every depth. This is the natural candidate for turning the prime-side aggregate into an endpoint telescope. ' +
      'A new 256-bit FLINT/Arb certificate proves γ₁<ωΔ=14.91686716625114666865…<γ₂ and γ₁<2ωΔ−γ₁=15.69900919076759954685…<γ₂. Independent Turing counts give N(ωΔ)=N(2ωΔ−γ₁)=1. The same certificate proves |M_(c♯)(ρ₁)|>3.67259729251241891699. Thus the shifted frequency γ₁−ωΔ is a nonzero singleton class: neither the zero harmonic nor the opposite controller harmonic can cancel it. ' +
      'No active shifted frequency is zero, so on RH the real uniformly almost-periodic response is nonzero with mean zero and takes both signs. The exact aggregate transfer gives Ω±(X^(3/2)) for every translate θ. Therefore exact endpoint periodicity cannot prove the required eventual positive order even if RH is true. This is a no-gain theorem for the telescoping controller, not a result about RH; a surviving Twin Ladder proof needs genuinely nonlocal prime correlation or another positive mechanism.',
    certificate:
      'proof/certificates/twin_ladder_first_radix/verify_dilation_aligned_controller.c',
  },
  {
    id: 'T176',
    color: ED.accent,
    status:
      'FINITE DERIVATIVE-LAYER NO-GO · ALL 0<a<1/2 · EXACT CONTINUUM UNTOUCHED',
    title: 'Finite derivative jets cannot repair the radial-layer tail',
    formula:
      'det J∂(T,T+h)=−c★²sinh²(ah)+O(e^((4a−2)T))<0, 0<a<1/2',
    detail:
      'Attach arbitrary finite derivative orders Ψ^(r)(t+x_j) to finitely many fixed radial or modular shifts and couple every resulting feature by any nonzero real PSD matrix. The exact theta tail gives Ψ^(r)(y)=(−2π)^r e^(2ry)Ψ(y)(1+O_r(e^(−2y))). PSD zero-row rigidity then isolates the least shift with positive diagonal mass and, at that shift, its highest active derivative. ' +
      'After a real diagonal congruence, every lower derivative is O(e^(−2T)) and every later shift is superexponentially smaller. The normalized two-point matrix is therefore one hyperbolic layer plus O(e^((2a−2)T)); its determinant is −c★²sinh²(ah)+O(e^((4a−2)T)), which is strictly negative eventually for every 0<a<1/2. ' +
      'This rigorously closes the natural fixed finite derivative-enriched extension of the T42 Gram ansatz throughout the small-thickness range needed for an RH descent. It does not classify a=1/2 or a>1/2, infinite derivative systems, continuous fibers, test-dependent or indefinite couplings, derivatives of a different carrier, or the exact continuum integral. The sole global Twin Ladder inequality and RH remain open.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.1',
  },
  {
    id: 'T177',
    color: ED.accent,
    status:
      'FULL INTEGER-MODULAR TOWER NO-GO · BOUNDED PSD COUPLING · ALL 0<a<1/2',
    title: 'Countably many isolated modular layers still cannot rescue the tail',
    formula:
      'Jmod=(eᵃ⁽ᵗ⁺ᵇ⁾⟨uₜ⁺,Cuᵦ⁺⟩−e⁻ᵃ⁽ᵗ⁺ᵇ⁾⟨uₜ⁻,Cuᵦ⁻⟩)/2; det₂→−c★²sinh²(ah)',
    detail:
      'Fix any finite derivative ceiling R and put u_t^±(k,r)=k^(±a)Ψ^(r)(t+log k) in ℓ²(N×{0,…,R}). Every nonzero bounded real PSD operator C defines the complete countable modular-layer kernel through the displayed Hilbert-space form; finite coordinate compressions recover the expected double modular sum without assuming absolute convergence of an unrestricted matrix series. ' +
      'A positive operator has some positive diagonal entry. Choose the least active integer k★ and the highest active derivative r★ there; every earlier or higher zero-diagonal coordinate is eliminated exactly by C. Uniform theta decay bounds the complete k>k★ normalized feature tail by O(e^(CT−c e^(2T))) in ℓ², while the surviving lower derivatives at k★ are only O(e^(−2T)). Boundedness of C therefore reduces the entire infinite system to the same single hyperbolic layer as T176. ' +
      'For every 0<a<1/2 and fixed h>0, the normalized 2×2 determinant is −c★²sinh²(ah)+O(e^((4a−2)T))<0 eventually. The exact continuum succeeds where this tower fails because its shifts accumulate at the lower integration edge. A surviving Gram route must use such lower-edge accumulation, unbounded effective derivative order or coupling, test dependence, a different carrier, or the genuine continuous radial integral. RH remains open.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.2',
  },
  {
    id: 'T178',
    color: ED.series1,
    status:
      'LOWER-EDGE DIMENSION CLASSIFIED · ATOMLESS TAIL RESCUE · GLOBAL PSD OPEN',
    title: 'Atomlessness is the mechanism behind the continuum tail rescue',
    formula:
      'x^(ν−1)g(x)dx ⇒ Hν(s,r)=[2cosh(s−r)]^(−ν); m₀δ₀ ⇒ det₂<0 for a<ν/2',
    detail:
      'Replace the discrete radial layers by the shift density x^(ν−1)g(x)dx, where ν>0, g is nonnegative and continuous at zero, and g(0)>0. Exact first-mode theta asymptotics followed by endpoint Laplace scaling give a positive diagonal normalization converging at fixed offsets to H_ν(s,r)=[2cosh(s−r)]^(−ν). ' +
      'The limit has an exact Gamma-integral Gram representation: H_ν(s,r)=Γ(ν)^(−1)∫y^(ν−1)(e^(νs)e^(−ye^(2s)))(e^(νr)e^(−ye^(2r)))dy. Distinct exponential rates make every fixed distinct-node principal matrix strictly positive. This recovers the ordinary continuum half-sech kernel at ν=1 and extends it to every positive lower-edge dimension. ' +
      'Accumulation alone is not sufficient. Adding an atom m₀δ₀ and normalizing by its layer leaves the two-point determinant −m₀²sinh²(ah)+O(e^((4a−2ν)T)), which is strictly negative whenever 0<a<ν/2. For ordinary dimension ν=1, the atom blocks the entire inner range 0<a<1/2. This is a quantified tail architecture theorem, not global kernel positivity, T3, or RH.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.3',
  },
  {
    id: 'T179',
    color: ED.series5,
    status:
      'CANONICAL TWO-BRANCH MODEL NO-GO · INDEFINITE ON EVERY TAIL · FIXED ORDERS POSITIVE',
    title: 'The half-sech limit plus its leading negative branch is not globally PSD',
    formula:
      'Bₐ(t,b)=(1−e^(−2a(t+b)))/(2cosh(t−b)); det₂(0,h)=−[(1−e^(−2ah))/(2cosh h)]²',
    detail:
      'The simplest attempted promotion of the fractional half-sech tail is symmetric, real analytic, and entrywise positive. Its relative Cᵐ error from H(t,b)=1/[2cosh(t−b)] is O(e^(−4aL)) on (L,∞)², so the fixed-order divided-difference argument makes every fixed distinct-node matrix order positive sufficiently far out. ' +
      'Global positivity still fails. At the continuous boundary pair 0,h, the top-left entry vanishes while the off-diagonal entry is positive, giving the displayed strictly negative determinant. If the kernel were PSD on any tail, real-analytic Gram continuation would extend PSD across the connected positive quadrant and contradict that boundary minor. Therefore Bₐ is indefinite on every tail, with the least negative witness order escaping to infinity. ' +
      'This rules out the half-sech limit plus only its leading negative-sinh branch as the missing global Gram kernel. The exact endpoint y/S dependence, theta-R remainder, and cross-scale corrections are essential. It is a model obstruction, not an obstruction to the exact continuum kernel and not a proof or disproof of RH.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.4',
  },
  {
    id: 'T180',
    color: ED.accent,
    status:
      'EXACT ENDPOINT-ONLY MODEL NO-GO · EVERY TAIL INDEFINITE · 0<a<1/2',
    title: 'The full endpoint integral still needs the theta remainder',
    formula:
      '2I′(λ)=∫₁∞q^(λ−1)e^(−2πq)(1+λ+λlogq−2πq)dq<0, 4<λ<5',
    detail:
      'Set only R≡1 in the exact endpoint identity, retaining both hyperbolic branches and the complete y/S dependence. Equivalently use the pure leading carrier φ₀(v)=exp(9v/2−πe^(2v)). At the boundary the kernel is positive on the diagonal and has zero first derivative, while its mixed derivative is [I(9/2+a)−I(9/2−a)]/2 with I(λ)=∫₀∞[(exp(λx−πe^(2x)))′]²dx. ' +
      'A substitution q=e^(2x) and one exact incomplete-gamma recurrence give the displayed derivative formula. Its final factor is negative at q=1 when λ<2π−1 and decreases thereafter because λ/q−2π<0. Thus I is strictly decreasing on 4<λ<5. For every 0<a<1/2 the boundary mixed derivative is negative, producing a negative 2×2 determinant at sufficiently close nodes; continuity moves it inside the positive quadrant and real-analytic Gram continuation rules out PSD on every tail. ' +
      'The model still approaches the half-sech kernel in every fixed Cᵐ tail norm, so each fixed matrix order eventually becomes positive and the negative witness order escapes. Exact endpoint scaling is not the rescue: the nontrivial theta-R factor and its cross-scale products are now essential. This does not decide the exact theta kernel, T3, or RH.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.5',
  },
  {
    id: 'T181',
    color: ED.series3,
    status:
      'EXACT THETA LOCAL RESCUE · 384-BIT ARB CERTIFICATE · GLOBAL PSD OPEN',
    title: 'The theta remainder reverses the first boundary obstruction',
    formula:
      'κ₁⧸₄=∂ₜ∂ᵦA₁⧸₄(0,0)=0.0445335330003967469414106437971±1.91×10⁻³²>0',
    detail:
      'For the full even theta carrier, integration by parts gives κₐ=∫₀∞sinh(2ax)(Ψ′(x)²−a²Ψ(x)²)dx−aΨ(0)², while exact evenness forces ∂ₜAₐ(0,0)=0. A new Arb verifier evaluates the 12-mode theta head on [0,2] at 384-bit precision and adds explicit enclosures for all omitted modes and the x≥2 tail. It proves the displayed strictly positive interval at a=1/4. ' +
      'Because A₁⧸₄(0,0)>0, the determinant for the nearby boundary pair 0,h equals A₁⧸₄(0,0)κ₁⧸₄h²+O(h³) and is positive for sufficiently small h. The endpoint-only R≡1 carrier has negative mixed curvature, so the exact theta remainder is rigorously a real local rescue mechanism rather than a cosmetic asymptotic correction. ' +
      'This certifies one local two-point necessary condition only. It gives no uniform h range, no higher principal-minor control, no PSD on an interval, and no proof of T3 or RH.',
    certificate:
      'proof/certificates/twin_ladder_channel_split/verify_exact_boundary_curvature_arb.c',
  },
  {
    id: 'T182',
    color: ED.series3,
    status:
      'FIVE-LEVEL EXACT BOUNDARY JET POSITIVE · 512-BIT ARB · UNIFORMITY OPEN',
    title: 'The local theta rescue persists through order four',
    formula:
      'J₁⧸₄⁽⁴⁾(m,n)=∂ₜᵐ∂ᵦⁿA₁⧸₄(0,0)/(m!n!) ≻ 0; det=3.7381461390968124752×10⁻⁶',
    detail:
      'Differentiate the exact same-sign block before integration. With g±(x)=Ψ(x)e^(±x/4), the Taylor-normalized jet entry is [2m!n!]⁻¹∫₀∞(g₊⁽ᵐ⁾g₊⁽ⁿ⁾−g₋⁽ᵐ⁾g₋⁽ⁿ⁾)dx. Exact theta evenness gives g₋(x)=g₊(−x), so every entry with m+n odd vanishes after reflection and integration by parts; the matrix splits into even and odd derivative blocks. ' +
      'A new 512-bit Arb verifier evaluates twelve theta modes on [0,2] and attaches explicit enclosures for every omitted mode and the x≥2 tail. All five leading principal determinants for derivative orders 0 through 4 are strictly positive. The full determinant is 3.73814613909681247520798344427×10⁻⁶ with radius 3.45×10⁻³⁶, so Sylvester’s criterion certifies positive definiteness. ' +
      'This extends T181 from local curvature to five confluent derivative levels and implies positivity for sufficiently tight generic five-point boundary clusters. It supplies no order-uniform lower bound, no PSD interval, and no proof of T3 or RH.',
    certificate:
      'proof/certificates/twin_ladder_channel_split/verify_exact_boundary_jet_arb.c',
  },
  {
    id: 'T183',
    color: ED.brass,
    status:
      'EXACT ALL-ORDER BOUNDARY CRITERION · ONE-SIDED ENERGY · RH-EQUIVALENT SEQUENCE',
    title: 'The remaining gap is positive-half-line dominance at every derivative degree',
    formula:
      'c*Jₐc=½∫ℝsgn(x)|P(D)(e^(ax)Ψ(x))|²dx ≥ 0 for every even/odd P',
    detail:
      'Let hₐ(x)=e^(ax)Ψ(x). Differentiating the exact same-sign block gives the boundary coefficient matrix from T182. Exact theta evenness implies h₋ₐ(x)=hₐ(−x), eliminates every mixed even/odd jet entry, and converts each pure-parity polynomial quadratic form into the displayed signed energy identity. ' +
      'Therefore the complete boundary hierarchy is positive exactly when ‖P(D)hₐ‖L²(−∞,0)≤‖P(D)hₐ‖L²(0,∞) for every even polynomial and every odd polynomial. This condition is sufficient as well as necessary: normal convergence of the two-variable Taylor series yields PSD in a neighborhood of the boundary, real-analytic Gram continuation propagates it across the positive half-line, and Wiener-Hopf rigidity identifies same-sign positivity with the complete fixed-thickness Twin Ladder condition. ' +
      'Imposing the hierarchy along any prescribed sequence aₙ↓0 is equivalent to RH by the divisor theorem. T182 first verified degrees 0 through 4 at a=1/4, and T192 extends that finite certificate through degree 16. T183 remains an exact reformulation and a sharper approach map—not a proof.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.8',
  },
  {
    id: 'T184',
    color: ED.series1,
    status:
      'INFINITESIMAL FIVE-LEVEL JET POSITIVE · 512-BIT ARB · ALL-DEGREE GAP',
    title: 'The boundary rescue survives the zero-thickness first variation',
    formula:
      'L⁽⁴⁾=∂ₐJₐ⁽⁴⁾|ₐ₌₀ ≻ 0; det L⁽⁴⁾=0.00348304876648921553805367897840',
    detail:
      'Differentiate the T183 hierarchy at zero thickness. Since P(D)(e^(ax)Ψ)=e^(ax)P(D+a)Ψ, its first variation is xP(D)Ψ+P′(D)Ψ. Entrywise this gives L(m,n)=[m!n!]⁻¹∫₀∞[2xΨ⁽ᵐ⁾Ψ⁽ⁿ⁾+mΨ⁽ᵐ⁻¹⁾Ψ⁽ⁿ⁾+nΨ⁽ᵐ⁾Ψ⁽ⁿ⁻¹⁾]dx, omitting negative derivative indices. ' +
      'The extended 512-bit Arb verifier evaluates the exact theta head and explicit mode/integration tails for derivative orders 0 through 4. All five leading principal determinants are positive; the full determinant is 0.00348304876648921553805367897840 with radius 3.06×10⁻³³. Thus the five-level exact rescue is not confined to a=1/4 but persists in the first variation at a=0. ' +
      'This is finite-order evidence in the vanishing-thickness regime. It does not prove the all-degree infinitesimal hierarchy, a lower bound uniform for small positive a, fixed-thickness PSD, or RH.',
    certificate:
      'proof/certificates/twin_ladder_channel_split/verify_exact_boundary_jet_arb.c',
  },
  {
    id: 'T185',
    color: ED.brass,
    status:
      'ALL-DEGREE INFINITESIMAL HIERARCHY · EXACTLY RH-EQUIVALENT · NOT A STRICT REDUCTION',
    title: 'Every infinitesimal jet level recovers the full de Branges criterion',
    formula:
      'c*Lc=(2/π)∬P(iλ)P(iμ)̅L₀(λ,μ)dλdμ; all d PSD ⇔ L₀ PSD ⇔ RH',
    detail:
      'Fourier transformation of the T184 signed-energy first variation identifies every polynomial jet quadratic form with the displayed integral against the infinitesimal de Branges kernel L₀(λ,μ)=[Ξ(λ)Ξ′(μ)−Ξ′(λ)Ξ(μ)]/[π(λ−μ)]. Its diagonal singularity is removable and completed-Ξ decay makes all polynomial integrals convergent. ' +
      'Under RH, the rank-one expansion over real zeros makes every form nonnegative. Conversely, positivity in every finite degree extends from polynomials to compact bumps by density in a suitable exponentially weighted L² space. Approximate identities recover all real evaluation matrices of L₀; confluent limits and the entire Taylor expansion recover the full complex kernel. The established de Branges criterion then gives RH. ' +
      'Thus the all-degree infinitesimal hierarchy is a concrete exact reformulation, not an easier theorem. T184 first certified derivative degrees 0 through 4, and T192 extends the exact 512-bit sign certificate through degree 16. Seventeen levels remain finite evidence rather than a proof of RH.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.10',
  },
  {
    id: 'T186',
    color: ED.accent,
    status:
      'NORMALIZED JET FLOOR · EXACT ZERO-MARGIN DICHOTOMY · COERCIVITY REFUTED',
    title: 'The finite jet exhaustion must approach RH at zero margin',
    formula:
      'λd=min(c*L⁽ᵈ⁾c/c*G⁽ᵈ⁾c); RH ⇔ λd↓0, while ¬RH ⇔ λd<0 at finite d',
    detail:
      'Whiten the infinitesimal jet by the positive parity-block Gram matrix G⁽ᵈ⁾ of Ψ⁽ᵐ⁾/m!. The coefficient spaces are nested, so their least generalized eigenvalues λd are nonincreasing. T185 already says that every λd is nonnegative exactly under RH. ' +
      'The translation symbol P_T(z)=e^(−Tz) gives P_T(D)Ψ(x)=Ψ(x−T). Its infinitesimal numerator is exactly 2∫_T^∞uΨ(u)²du, while the combined even/odd derivative energy is the fixed value ‖Ψ‖²/2. Taylor polynomials transfer this quotient into the finite jet spaces and force the attainable margin to zero. Thus RH means λd decreases to zero; failure of RH produces a negative witness at a finite degree. No degree-uniform coercive proof is possible. ' +
      'A high-precision incomplete-gamma scan gives λ₁₆≈1.1366×10⁻¹⁰. T192 now Arb-certifies positivity of the exact infinitesimal form through d=16, although that displayed generalized eigenvalue remains a non-interval conditioning diagnostic. Raw determinant growth is still misleading—the remaining theorem must preserve sign at vanishing margin for every degree.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.11',
  },
  {
    id: 'T187',
    color: ED.series3,
    status:
      'TRANSLATED PARITY PACKETS POSITIVE · STRICT CONCAVITY · ZERO MARGIN FROM ABOVE',
    title: 'The canonical near-null packets cannot hide a negative direction',
    formula:
      'Qeven(T)=R(T)+D(T)>0; Qodd(T)=R(T)−D(T)>0 because D(T)<R(T)',
    detail:
      'Split the T186 translation symbol e^(−Tz) into cosh(Tz) and −sinh(Tz). Their infinitesimal forms are exactly R+D and R−D, where R(T)=∫_T^∞uΨ(u)²du and D(T)=∫₀^∞xΨ(x−T)Ψ(x+T)dx. Only the odd difference has a possible sign issue. ' +
      'A classical strict concavity theorem for the Riemann–Jacobi kernel states that s↦log Ψ(√s) is strictly concave. Apply it to (T−x)² and (T+x)²: Ψ(x−T)Ψ(x+T)<Ψ(√(T²+x²))². Multiplying by x and substituting u=√(T²+x²) proves D(T)<R(T) for every T>0. Both parity quotients therefore approach the T186 zero margin strictly from above. ' +
      'This is an unconditional infinite-family sign theorem, not RH. It closes translated packets only. If an off-line zero exists, its finite-degree negative witness must use a genuinely non-translation derivative superposition.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.12',
  },
  {
    id: 'T188',
    color: ED.series5,
    status:
      'TRANSLATION MIXTURES · POSITIVE ENTRIES · LOCAL PSD IS RH-EQUIVALENT',
    title: 'Interference between translated packets already contains the full problem',
    formula:
      'Ktr(T,S)=∫₀∞(2a+T+S)Ψ(a+T)Ψ(a+S)da>0; local finite-matrix PSD ⇔ RH',
    detail:
      'Polarize the infinitesimal form between e^(−Tz) and e^(−Sz). Evenness of Ψ cancels the signed central interval and gives the displayed positive-entry kernel. A finite exponential polynomial E(z)=Σcⱼe^(−Tⱼz) has form c*Ktr c, so T187 controls only its diagonal packets. ' +
      'For every ε>0, PSD of all finite Ktr matrices with nodes in [0,ε] is equivalent to RH. The forward direction follows from the T185 polynomial criterion and Taylor convergence. Conversely, Δh(z)=(1−e^(−hz))/h tends to z, while P(Δh) uses only the nodes 0,h,…,(deg P)h. Local translation PSD therefore recovers every polynomial jet inequality and T185 gives RH. If RH is false, negative translation matrices must occur on arbitrarily fine grids at the origin. ' +
      'The new high-precision scanner finds positive matrices on the tested one-mode and full-theta grids, but their confluent eigenvalues collapse toward zero. This is exploratory, not an interval certificate. Entrywise positivity does not imply PSD, and there is no uniform spectral gap for a first-mode-plus-small-tail perturbation proof.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.13',
  },
  {
    id: 'T189',
    color: ED.brass,
    status:
      'CONCAVITY-ONLY MIXTURE ROUTE REFUTED · 256-BIT ARB · MODEL CLASS ONLY',
    title: 'Positive individual packets do not control three-packet interference',
    formula:
      'f=e^(−x²)−½e^(−2x²); (log f(√s))″<0, but det[Kf(2j/3,2k/3)]j,k=1³<0',
    detail:
      'Use the positive even model f(x)=e^(−x²)−½e^(−2x²). Writing r=e^(−s)/2 gives (d²/ds²)log f(√s)=−r/(1−r)²<0, exactly the strict square-radius log-concavity used in T187. The same argument therefore makes every individual even and odd translated packet positive. ' +
      'Gaussian completion gives a closed erfc formula for every mixed kernel entry. At translation nodes 2/3, 4/3, and 2, the new 256-bit Arb verifier encloses the positive-entry 3×3 determinant at −1.86651773158276928117×10⁻¹¹ ± 3.42×10⁻⁶¹, strictly below zero. Its Fourier transform also has explicit nonreal zeros. ' +
      'This is a rigorous model-class counterexample to the implication “T187 concavity ⇒ T188 mixture PSD.” It is not a counterexample to the Riemann–Jacobi theta kernel and does not disprove RH. Any successful translation-kernel proof must add zeta-specific structure that controls at least three-packet interference.',
    certificate:
      'proof/certificates/twin_ladder_channel_split/verify_square_concavity_mixture_counterexample_arb.c',
  },
  {
    id: 'T190',
    color: ED.series1,
    status:
      'TWO-PACKET MATRICES POSITIVE · SHARP CONCAVITY THEOREM · THREE PACKETS FIRST UNRESTRICTED',
    title: 'Square-radius concavity controls exactly two translated packets',
    formula:
      'Kf(T,S)²≤Kf(T,T)Kf(S,S), strictly for T≠S; every 2×2 theta principal matrix ≻0',
    detail:
      'Let h(u)=log f(√u) be concave. For T≥S, write m=(T+S)/2, d=(T−S)/2, p=y²−m², and q=√(m²+p). Evenness rewrites the mixed kernel as ∫₀∞f(q−d)f(q+d)dp. ' +
      'The squared pair (q−d)²,(q+d)² has the same sum as S²+p,T²+p but is farther apart. Concavity therefore bounds the mixed integrand by f(√(S²+p))f(√(T²+p)). Cauchy–Schwarz gives Kf(T,S)²≤Kf(T,T)Kf(S,S); strict concavity makes it strict at distinct nodes. ' +
      'The Riemann–Jacobi kernel has the required strict concavity, so every distinct two-node principal translation matrix is unconditionally positive definite. T189 proves the mechanism is sharp: three-node PSD does not follow for a general model. T190 alone forces any negative translation matrix to use at least three distinct packets; T191 adds stronger theta-specific protection for sufficiently small clusters.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.15',
  },
  {
    id: 'T191',
    color: ED.series3,
    status:
      'FIVE-PACKET ORIGIN NEIGHBORHOOD POSITIVE · DIVIDED DIFFERENCES · SIX PACKETS FIRST LOCAL RISK',
    title: 'The certified infinitesimal jet protects every five-packet origin cluster',
    formula:
      '∂Tᵐ∂SⁿKtr(0,0)/(m!n!)=Lmn; ∃ε₅>0: N≤5 and distinct Tⱼ∈[0,ε₅] ⇒ [Ktr(Tⱼ,Tₖ)]≻0',
    detail:
      'Expanding the T188 kernel at the origin identifies its Taylor coefficient matrix exactly with the infinitesimal boundary jet L: the factors 2a, T, and S reproduce the three terms in the T184 integral formula. ' +
      'For five ordered nodes, the invertible Newton divided-difference transformation acts by congruence on the evaluation matrix. The mixed Hermite–Genocchi formula expresses every transformed entry as an average of a mixed derivative inside the node interval. Consequently the transformed matrix converges uniformly to L⁽⁴⁾ as the whole interval shrinks, including arbitrarily uneven node collisions. ' +
      'The 512-bit T184 certificate proves L⁽⁴⁾ positive definite, so openness gives an ε₅>0 on which every matrix of at most five distinct theta translations is positive definite. Thus if RH is false, T188 still forces negative matrices into every smaller origin interval, but each must use at least six packets. The interval is existential; three or more packets at unrestricted translations and all matrix sizes near zero remain open, so RH is not proved.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.16',
  },
  {
    id: 'T192',
    color: ED.brass,
    status:
      'DEGREE-SIXTEEN JETS POSITIVE · 512-BIT ARB · SEVENTEEN PACKETS LOCALLY PROTECTED',
    title: 'The rigorous finite frontier now reaches seventeen translated packets',
    formula:
      'J₁⧸₄⁽¹⁶⁾≻0 and L⁽¹⁶⁾≻0; ∃ε₁₇>0: N≤17, Tⱼ∈[0,ε₁₇] distinct ⇒ [Ktr(Tⱼ,Tₖ)]≻0',
    detail:
      'The exact boundary-jet verifier is now dimension-parametric and is replayed at 512-bit precision with DIM=17. It retains twelve theta modes on [0,2], attaches derivative-order-dependent enclosures for all omitted modes and the x≥2 tail, and checks all seventeen leading principal determinants of both the fixed-thickness matrix J₁⧸₄⁽¹⁶⁾ and the infinitesimal matrix L⁽¹⁶⁾. ' +
      'Every enclosure is strictly positive. The final determinants are 3.62192046532966786793×10⁻⁹ ± 1.03×10⁻³⁹ for J₁⧸₄⁽¹⁶⁾ and 33.5739665585352850204 ± 7.74×10⁻³¹ for L⁽¹⁶⁾. Sylvester’s criterion therefore certifies both 17×17 jets positive definite and upgrades every previously exploratory finite sign through d=16. ' +
      'Applying T191’s mixed divided-difference theorem gives an ε₁₇>0 on which every theta translation matrix with at most seventeen distinct nodes is positive definite. If RH is false, T188 still forces negative matrices arbitrarily close to zero, but each must use at least eighteen packets, equivalently start at polynomial degree at least seventeen. This remains a finite-order existential neighborhood, not all-degree positivity or a proof of RH.',
    certificate:
      'proof/certificates/twin_ladder_channel_split/verify_exact_boundary_jet_arb.c · compile with -DDIM=17',
  },
  {
    id: 'T193',
    color: ED.accent,
    status:
      'CANONICAL-ROOT SHORTCUT REFUTED · EXACT −1/216 MODEL WITNESS · THETA DEFORMATIONS OPEN',
    title: 'The near-null root lattice does not inherit translated-packet positivity',
    formula:
      'P(z)=z(1+z²/8), zeros(P)={0,±2√2i}, but ℓf(P)=−1/216 in the strict-concavity T189 model',
    detail:
      'Exploratory theta minimizers through degree 24 have negative y=z² roots close to the half-integer cosh and integer sinh Euler-product lattices. That geometry is real but not sign-stable: at degree 24 the best one-parameter canonical product has derivative-energy overlap 0.99806 with the true even minimizer, yet its Rayleigh value is about 62.85 times larger. The small root deformations are essential at the collapsing T186 margin. ' +
      'The generic shortcut fails exactly. For f(x)=e^(−x²)−½e^(−2x²), strict square-radius concavity makes every complete translated parity packet positive. Nevertheless the first sine factor at T=π/(2√2), P(z)=z+z³/8, has only pure-imaginary zeros and normalized odd block [[1/9,−25/162],[−25/162,50/243]], giving ℓf(P)=−1/216 by rational arithmetic. ' +
      'This does not produce a negative theta polynomial. It proves that T187, imaginary-root geometry, and ordinary canonical-product convergence cannot control the finite theta minimizers; a successful proof must sign their finite root deformations directly at the vanishing eigenvalue scale. RH remains open.',
    certificate:
      'proof/certificates/twin_ladder_channel_split/verify_canonical_product_truncation_counterexample_exact.py',
  },
  {
    id: 'T194',
    color: ED.series1,
    status:
      'WHOLE-TAIL FIXED-ORDER POSITIVITY · SECH LIMIT · THREE-PACKET RISK TOUCHES LEFT INTERVAL',
    title: 'Every fixed packet count is eventually positive on the translation tail',
    formula:
      'K̃tr(t,b)→sech(t−b); ∀n ∃Ltr,n: distinct tⱼ≥Ltr,n and N≤n ⇒ [Ktr(tⱼ,tₖ)]≻0',
    detail:
      'Factoring the first theta mode and using the exact endpoint variable y=(e²ᵗ+e²ᵇ)(e²ˣ−1) gives a boundary-layer formula valid uniformly even when |t−b| is unbounded. Division by Dtr(t)=4√2π³⧸²√t exp(7t/2−πe²ᵗ) leaves sech(t−b) plus an error that tends to zero in every fixed whole-tail derivative norm. ' +
      'The limit has exact principal determinant ∏i<j tanh²(tⱼ−tᵢ). The T48 cluster/divided-difference compactification removes collision Vandermondes, while block splitting controls unbounded gaps. Thus every fixed matrix order is positive on one entire right tail. ' +
      'An adaptive Gauss–Laguerre grid locates the hardest resolved three-packet point near (1.975,2.075,2.175), where separately scaled 80-digit quadrature gives normalized determinant 3.608853263731643×10⁻⁶. That scan is non-interval and not part of the proof. T194 forces any three-packet obstruction to touch a bounded left interval; Ltr,n depends on n, so no all-order tail PSD, all-degree origin theorem, or RH follows.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.19 · proof/certificates/twin_ladder_channel_split/scan_translation_three_packet_global.py',
  },
  {
    id: 'T195',
    color: ED.series5,
    status:
      'STRICT THREE-PACKET REDUCTION · ALL ESCAPES POSITIVE · COMPACT INTERIOR CERTIFICATE OPEN',
    title: 'Every possible three-packet obstruction lies in one compact interval',
    formula:
      'WΨ(T)>0 and Rtr(t,b)=poly(b)e^(−b)→0 for bounded t; ∃Mtr,3<∞ containing every nonpositive triple',
    detail:
      'The T190 comparison stays quantitatively strict when two translated packets collide. If h(u)=log f(√u), the determinant divided by the squared node gap is bounded below by 2Kf(T,T)∫₀∞f(√(T²+p))²[−p h″(T²+p)]dp, which is positive for theta by T187 strict concavity. ' +
      'A separate one-sided endpoint expansion shows that the correlation-normalized kernel and every fixed derivative between a bounded node and b→∞ decay like a polynomial times e^(−b). Thus every escaping ordered triple decouples into positive blocks: T194 handles three far nodes and a far pair, while T190 plus the new confluent margin handles a bounded pair. ' +
      'Therefore some finite Mtr,3 contains all nodes of every nonpositive three-packet matrix, if any. The triple-collision face is the translated degree-two jet; its stable endpoint-gauged determinant tends to 1, and the exact lower-limit derivative of its raw determinant is negative at every sampled T>0. Independent interval entry boxes lose those correlated cancellations, so a shared Taylor enclosure is required. The sech-relative exploratory grid reaches 0.89423611571 at (0,1.35,2.125), where scaled 100-digit quadrature gives normalized determinant 0.272485224924370778975865. None of these values are interval certificates. The explicit compact bound, compact-domain sign, higher packet counts, and RH remain open.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.20 · proof/certificates/twin_ladder_channel_split/scan_translation_three_packet_global.py',
  },
  {
    id: 'T196',
    color: ED.series3,
    status:
      'RIGOROUS 0≤T≤2 COLLISION COVER · 4096 ARB BOXES · GLOBAL THREE-PACKET SIGN OPEN',
    title: 'The translated triple-collision jet is positive on its first two units',
    formula:
      'Jtriple(T)≻0 for 0≤T≤2; Δ₃′(T)<0 after the origin box and Δ₃(2)/J₂(0,0)³=0.939231127963760833±2.35×10⁻¹⁹',
    detail:
      'The missing correlated enclosure is now implemented on a continuous interval. T196 partitions [0,2] into 4,096 boxes of width 1/2048 and carries one order-fourteen Taylor variable through all six entries of the translated degree-two jet, a fixed unit-triangular endpoint gauge, and determinant multilinearity. Twelve-mode center integrals to u=3 run at 768-bit precision with a uniform omitted-mode and tail allowance 1.26761753931×10⁻²¹¹ ± 3.68×10⁻²²³. ' +
      'The box containing T=0 has normalized determinant 2.4848 ± 4.62×10⁻⁵ > 0. On each of the other 4,095 boxes, the exact lower-limit identity J′=−I certifies Δ₃′(T)<0. Since the normalized determinant at T=2 is still 0.939231127963760833 ± 2.35×10⁻¹⁹ > 0, Δ₃ stays positive throughout [0,2]. T190 supplies the strict leading two-node confluent minor, so Sylvester’s criterion gives the full 3×3 jet positive definite there. ' +
      'This is the compact first segment; T197 below supplies the tail join. The nonconfluent compact interior, higher packet counts, and RH remain open.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.21 · proof/certificates/twin_ladder_channel_split/run_translation_triple_collision_taylor.sh',
  },
  {
    id: 'T197',
    color: ED.series1,
    status:
      'RIGOROUS T≥2 TAIL JOIN · COMPLETE TRIPLE-COLLISION FACE · NONCONFLUENT INTERIOR OPEN',
    title: 'The translated triple-collision jet is positive for every translation',
    formula:
      'supT≥2 ‖H(T)−H∞‖₂ ≤ 0.237144301660067167 < (9−√17)/16; therefore Jtriple(T)≻0 for all T≥0',
    detail:
      'T197 approaches the exact quantitative target left by T196. The T194 boundary-layer formula factors the normalized kernel into A(t,b)=(t+b)/(2√tb cosh(t−b)) and a theta correction B(t,b). A 256-bit bivariate degree-(2,2) Arb jet covers 128 exact T-boxes on [2,4], then encloses the entire T≥4 tail by 0≤1/T≤1/4 and 0≤e⁻²ᵀ≤e⁻⁸. It integrates 2,000 exact y-boxes through 40 and one box through 1,000; elementary estimates place the remaining y-tail and theta modes n≥2 far below the reserved 10⁻³⁰ allowance. ' +
      'The explicit algebraic-sech jet differs from H∞ in Frobenius norm by at most 0.125278163400880268, while coefficient convolution bounds the correction by 0.111866138259186899. Their sum 0.237144301660067167 is strictly below half the limiting spectral gap, (9−√17)/16≈0.3048058984. Thus the normalized jet is positive for every T≥2. Together with T196 on [0,2], this proves the full triple-collision boundary J(T)≻0 for every T≥0. ' +
      'This is not global three-packet positivity and not RH. The next finite-order obstruction is the nonconfluent compact three-node interior; higher packet counts also remain open.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.22 · proof/certificates/twin_ladder_channel_split/run_translation_triple_collision_tail.sh',
  },
  {
    id: 'T198',
    color: ED.series5,
    status:
      'RIGOROUS ORIGIN-SLICE INTERIOR RECTANGLE · EXPLORATORY MINIMUM INCLUDED · COMPLEMENT OPEN',
    title: 'The hardest resolved origin-slice rectangle is positive',
    formula:
      't₁=0, 49/40≤t₂, t₂+1/2≤t₃≤6 ⇒ det K̄(tᵢ,tⱼ) > 0.000556506552749633686',
    detail:
      'T198 moves beyond collision boundaries into the nonconfluent three-node interior. The positive scale Etr(t)=4√2π³ᐟ² exp(7t/2−πe²ᵗ) is nonsingular at t=0 and turns the exact T194 boundary-layer kernel into an order-one matrix. The verifier evaluates twelve theta modes at 384-bit precision, integrates y through 40, reserves 10⁻³⁵ for the smaller mode and integral tails, and covers exact node boxes of width 1/40. ' +
      'Every determinant is strictly positive throughout t₁=0, 49/40≤t₂, t₂+1/2≤t₃≤6. The certified lower endpoint is 0.000556506552749633686. This rectangle contains the exploratory sech-relative minimum near (0,1.35625,2.1125), so the numerically hardest resolved origin-slice region is no longer merely sampled. ' +
      'This is still not the global three-packet theorem or RH. The checkpointed next sequence is: retain shared variables in the exact pair-collision Gram matrix and thicken through t₃−t₂≤1/2; join the small-t₂ origin strip to the certified triple-collision face; close the origin-slice tail beyond 6 by block splitting; then propagate the completed slice through common translations t₁>0. Higher packet counts remain a later obstruction, and none of these planned certificates is counted as proved.',
    certificate:
      'proof/TWIN_LADDER_MODULAR_REGROUPING.md §6.23 · proof/certificates/twin_ladder_channel_split/run_translation_three_packet_origin_slice.sh',
  },
];

const DYSON_LANE_RESIDUALS = [
  {
    id: 'R1',
    tag: 'sg1c-r1-excursion-cap',
    color: ED.brass,
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
      { to: '/spectral-attack', label: 'Spectral Approach (c_glob context)' },
    ],
  },
  {
    id: 'R2',
    tag: 'sg1c-r2-isolation-persistence',
    color: ED.series5,
    badge: 'CLOSED FORM (2026-08-28)',
    title: 'R2: global asymmetric isolation constant c_glob = c_half = 0.8980208880762339',
    status: 'CLOSED (closed form)',
    body: [
      'The global asymmetric multi-body isolation constant c_glob is defined as the infimum of ' +
      'all worsening-onset values rho(c) over all asymmetric multi-body environments. ' +
      'It is now CLOSED in closed form (2026-08-28): c_glob = c_half = 0.8980208880762339, the ' +
      'unique (0,1) root of R(rho) = 4 + 4rho - 4/rho - 4/(rho+1) - 2[psi(1+2/rho) - psi(1+1/rho)] ' +
      '— the universal rate bound d_1^2 (drho/ds) <= R(rho) holds for every admissible ' +
      'configuration and is sharp along the one-sided half-lattice ' +
      '(src/data/sg1c-cglo-closure-2026-08-28.js).',
      'Historically observed onsets included ' + C_OBSERVED_MIN.toFixed(7) +
      ' (imp-3172 Config-B smooth onset, the lowest computationally located ' +
      'onset) and c_asym = ' + C_ASYM.toFixed(10) +
      ' (the asymmetric R-to-infinity class, imp-3170); both upper-bound the infimum and are ' +
      'consistent with the closed value. ' +
      'The Theorem-C basin (C_Lip) only requires c <= 0.72; the closure anchors that basin ' +
      'hypothesis to a proven constant (margin 0.178) but improves no Lambda bound.',
      'Residuals that stay open: R1 minimality-transfer (the pair losing global minimality voids ' +
      'the spacing floor) and the off-basin regime rho in (c_half, 1).',
    ],
    links: [
      { to: '/onset-bracket-ledger', label: 'Onset Bracket Ledger' },
      { to: '/spectral-attack', label: 'Spectral Approach (c_glob viz)' },
    ],
  },
  {
    id: 'G6a',
    tag: 'step-4-polymath15-bridge',
    color: ED.series1,
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
      'Separately, the standalone repository presents ' +
      'Lambda <= 0.1787854 as a computer-assisted candidate for an unconditional proof ' +
      'through an independent route. The bound is not established, has been reviewed by Dan Romik, and is ' +
      'not RH. The candidate does not close G6a or descend to zero.',
      'Closing G6a fully requires the actual missing strip-uniform fold estimate or one ' +
      'of the parallel routes (imp-368+369+336 Route A, or imp-342+337 Route C). ' +
      'Those routes remain open.',
      'Citation audit (imp-33637): arXiv:1904.12438 contains only Lemma 5.1 in ' +
      'Section 5, not a Lemma 5.2 matching this Hölder-1/2 claim. imp-33649 ' +
      'traced the fold-catastrophe exponent instead to Whitham, Linear and ' +
      'Nonlinear Waves (1974). The nonexistent lemma is not a live closure ' +
      'route; G6a_shock_lipschitz remains OPEN (PARTIAL).',
      'Status note (imp-33766): H4 (the strip-height fold-reading derivative m_prime) ' +
      'is NOT independently dischargeable -- the Holder-modulus back-conversion couples it to ' +
      'H3 (the curvature coefficient m_double_prime) through the same quadratic fold expansion, ' +
      'and H3 dominates H4 a fortiori. H4 and H3 therefore collapse into ONE coupled ' +
      'strip-height-uniformity object, essential at the H3 rung; this is scoping only and ' +
      'discharges nothing, so G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above.',
      'Status note (imp-33794): the measured finite-band C_ren(N) window (the renormalized ' +
      'fold-reading amplitude across the eps = y_N^sharp ladder) is CONSISTENT-WITH the H4 ' +
      'finite-window minimal-input requirement but does NOT DISCHARGE H4 -- the uniform bound needs ' +
      'the ANALYTIC tracking of C_ren through the fold-modulus back-conversion, not an empirical ' +
      'band checked on a finite ladder, and it says nothing about the coupled H3 curvature rung ' +
      '(imp-33786) that dominates and jointly governs discharge. Measurement only; ' +
      'G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above.',
      'Status note (imp-35101, sharpening imp-3671): the direct-flow V0(gamma) route carries two ' +
      'INDEPENDENT obstructions, not one -- S1 (V0 is a strip-sup density scalar, the wrong TYPE of object for the ' +
      'required two-point spatial modulus |tau_c(x) - tau_c(x_prime)| <= C_Lip|x - x_prime|^{1/2}) and S2, now sharpened ' +
      'from merely Gronwall-vacuous to the wrong MONOTONE DIRECTION: tau_c is set by the nearest pair -- the ' +
      'HIGHEST-density region -- exactly where a density FLOOR carries no information. Retyping V0 to fix S1 does not ' +
      'fix S2; the only object fixing both is a minimal-gap LOWER bound, which is itself the RH-hard nearest-pair ' +
      'control (imp-2520/imp-348, GUE-conditional per imp-486). Separately, per imp-2640 the direct Gronwall discharge ' +
      'of C_H remains NEGATIVE, and the asymptotic modulo (imp-35056) persists regardless of route. No candidate ' +
      'closure via the density-floor measurement exists; G6a_shock_lipschitz stays OPEN (PARTIAL) exactly as above; ' +
      'changes no bound; NO QED.',
      'Honest-status note (imp-96290 sub-constant inventory): C_H isRigorousUpperBound = false ' +
      '(imp-2642/imp-2701 lock) -- of the three named Step-4 bridge objects, G6 (assembly) and G6a ' +
      '(this Holder-1/2 mechanism/exponent) are CLOSED, but the leading modulus constant C_H is not, and ' +
      'the residual gap localizes to the single factor C_Lip inside C_H = C_shock * C_Lip / 4 (C_shock is ' +
      'N-uniform and quantified, < 1/3). The polylog-over-N RATE of E(N) is unconditional; the E(N) -> 0 ' +
      'CONCLUSION stays gated on this one unproven constant. Inventory only; changes no bound; NO QED.',
    ],
    links: [
      { to: '/rh-dag', label: 'Proof DAG (G6a node)' },
      { to: '/lambda-bounds', label: 'Lambda Bounds' },
      { to: '/route-map', label: 'Route Map' },
    ],
  },
];

// Odlyzko interior-dip depth-scaling sub-gap. Already carries its own reproducible
// measurement and honest-status banner in src/data/ but was previously referenced only
// in the improvement log, not rendered on any page (imp-96541).
const DIP_DEPTH_RESIDUALS = [
  {
    id: 'DipDepth-1',
    tag: 'imp-96510-systematic-vs-noise-dip-depth-scaling',
    color: TK_STATUS.candidate.fg,
    badge: 'ZERO-SOURCE GAP: ~7 ORDERS OF MAGNITUDE',
    title: 'Odlyzko interior below-envelope dip: systematic vs sampling-noise depth scaling is undecided',
    status: 'OPEN',
    body: [
      'imp-96452 named the only lever that could lift the T = 1.5e5 number-variance excursion from ' +
      '~1.9-sigma to a clean 2-sigma: a comparably deep below-envelope dip at a higher unclipped ' +
      'height. Whether such a dip is reachable turns entirely on how the fractional dip depth relErr ' +
      'scales with height, and the two competing readings imply wildly different required zero-sources. ' +
      'Reading (A) SYSTEMATIC treats relErr as a fixed fractional feature, so z = relErr*sqrt(n_w/2) grows ' +
      'as T^(1/4) and a clean 2-sigma dip becomes cheap: height ~5.38e6, needing only ~1.44e7 zeros -- ' +
      'well inside existing 10^12 contiguous datasets. Reading (B) SAMPLING-NOISE treats relErr as shrinking ' +
      'with the chi-square floor sqrt(2/n_w), so z stays O(1) at every height and a 2-sigma dip is a rare ' +
      '~2.28% one-sided tail per independent height, only reachable via a statistical hunt across ~30 ' +
      'independent heights (50% chance) needing a contiguous source to ordinate ~2.44e13 (~1.09e14 zeros, ' +
      '~8.1x the Platt-Trudgian verified height ~3.0001e12) -- or ~100 heights (90%) needing ~1.55e32, ' +
      'astronomically out of reach. The two readings differ by ~7 orders of magnitude in the required ' +
      'zero-source.',
      'The imp-96493 two-anchor data favours reading (B): the measured depth shrank faster (0.425x) than ' +
      'the sampling floor (0.789x) from T = 1.5e5 to T = 3.879e5, so z FELL rather than rising as T^(1/4) ' +
      'would predict. The GUE number-variance envelope itself does not predict deeper dips become ' +
      'attainable at height. Follow-up fits (imp-96528, imp-96530) corroborate direction (B) across five ' +
      'more interior anchors -- higher-anchor mean depth collapsed 6.54x and the z-exponent came out ' +
      'negative, opposite the systematic sign -- but the free relErr(T) exponent remains too scattered ' +
      '(R^2 = 0.288) to rigorously PIN, so this sub-gap stays formally OPEN: deciding it needs 3+ ' +
      'independent unclipped interior heights beyond the existing 10^6-ordinate set, which the current ' +
      'data does not supply.',
      'Assessment/measurement only; changes no bound; RH open; NO QED.',
    ],
    links: [],
  },
];

// Route M (Nyman-Beurling Burnol/Vasyunin) numerical-program residuals. Each
// is a MEASUREMENT/FIT-ONLY sub-gap already carrying its own honest-status
// banner in src/data/ but not previously rendered on any page (imp-96518).
const ROUTE_M_RESIDUALS = [
  {
    id: 'RouteM-1',
    tag: 'imp-96487-remainder-model-degenerate',
    color: TK_STATUS.candidate.fg,
    badge: 'ASYMPTOTE UNDECIDED',
    title: 'Route M Burnol ratio: asymptotic-remainder model favors a plateau at ~0.985, not ratio -> 1',
    status: 'OPEN',
    body: [
      'The decaying-oscillation asymptotic-remainder model fit to the N=250..10000 ratio(N) = ' +
      'd_N^2 log N / C_burnol ladder favors a plateau centerline at ~0.985 over the RH asymptote ' +
      '1 by a factor ~1.9x in rms, robustly across every trial oscillation frequency. But the ' +
      'log-N window is only 3.689 wide (~2.26 oscillation periods) and the remainder decay ' +
      'exponent is degenerate, so the fitted centerline and decay rate are jointly ' +
      'underdetermined: the model gives no evidence for a drift to 1 and positively favors the ' +
      'plateau on the accessible range, but cannot rigorously exclude a centerline that creeps ' +
      'upward beyond N=10000 on a scale this window cannot resolve. Deciding the true asymptote ' +
      'needs a wider Gram ladder, not a further fit.',
      'RH open; no refereed bound is changed; NO QED. Measurement/fit only, no bound is claimed.',
    ],
    links: [],
  },
  {
    id: 'RouteM-2',
    tag: 'imp-96491-extrapolation-inconsistent-needs-new-form',
    color: TK_STATUS.candidate.fg,
    badge: 'EXTRAPOLATION FAILS',
    title: 'Route M Burnol ratio: the imp-96094 smooth fit extrapolates the wrong side of 1 -- needs a new functional form',
    status: 'OPEN',
    body: [
      'The imp-96094 smooth 1/logN + 1/logN^2 fit (N <= 2600), extrapolated to the imp-96105 ' +
      'extension rungs N=3000..6000, predicts ratio(N) rising ABOVE 1 (1.0126..1.0361), the ' +
      'opposite of the measured below-1 plateau (0.9639..0.9856). All seven residuals are ' +
      'one-signed (mean bias -0.0489), rms ~5.4x the in-sample rms and growing with N. The ' +
      'extrapolated fit has no out-of-sample predictive power; a new functional form (below-1 ' +
      'asymptote, added constant offset, or different 1/logN power) is required.',
      'RH open; no refereed bound is changed; NO QED. Pure-arithmetic evaluation of a baked fit, no refit, no bound is claimed.',
    ],
    links: [],
  },
  {
    id: 'RouteM-3',
    tag: 'imp-96466-doubledouble-ceiling-extrapolated-to-1e16',
    color: TK_STATUS.candidate.fg,
    badge: 'CONDITIONING NOT LIMITING',
    title: 'Route M Vasyunin double-double conditioning ceiling (~1.03e16) extrapolates measured fits by ~12 decades',
    status: 'OPEN (extrapolated)',
    body: [
      'Re-deriving the Cholesky-breakdown conditioning ceiling under double-double precision ' +
      '(eps=1e-32) from the imp-96443 measured lam_max log-fit and the imp-96428 measured ' +
      'lam_min power law gives N ~ 1.026e16, about 1.035e12 times the imp-96352 wall-clock ' +
      'compute ceiling N ~ 9916 -- compute still binds first by twelve orders of magnitude. But ' +
      'both inherited fits are measured only over N=250..6000, so this ceiling extrapolates them ' +
      'by ~12 decades in N. Because lam_max enters cond# only linearly while lam_min ~ N^-1.92 ' +
      'dominates, even an order-of-magnitude lam_max error moves the ceiling by a factor < 3 -- ' +
      'negligible against the ~1e12x margin, so the compute-binds-first verdict is robust to the extrapolation.',
      'RH open; no refereed bound is changed; NO QED. Extrapolation only, no Gram was rebuilt, no bound is claimed.',
    ],
    links: [],
  },
  {
    id: 'RouteM-4',
    tag: 'imp-97016-fm-data-alone-does-not-reject-concave-quad',
    color: TK_STATUS.candidate.fg,
    badge: 'DATA ALONE INCONCLUSIVE',
    title: 'Route M: the exact ||G||_F data alone cannot reject the concave-quad ceiling (imp-97016) -- the far N* ~ 4e7 extrapolation, not the local shape, keeps it in play',
    status: 'OPEN',
    body: [
      'Re-running the imp-96996 F < M monotonicity-partition against the freshest exact ' +
      '||G||_F rungs (extended to N=24000 by imp-96912) leaves the picture unchanged: the ' +
      'monotone line/tail models sit below the M_lo=3.919e7 canonical-band edge (F < M ' +
      'preserved), but the concave quad -- still the out-of-sample best LOCAL fit by 3.40x ' +
      'over the tail on those very rungs -- has ceiling N*=4.088e7, ABOVE M_lo (F < M ' +
      'inverted by +4.30 percent). So F < M holds only under the Step-1 monotonicity prior, ' +
      'not from the exact data alone: extending the exact ladder by another 0.176 decade did ' +
      'not change which model the data favors. What keeps the quad in play is the ~3.23-decade ' +
      'far extrapolation to N* ~ 4e7, not the local shape near N=24000; rejecting it from the ' +
      'data alone needs exact rungs reaching a substantial fraction of that scale, which is an ' +
      'O(N^3) V-table build currently CPU-blocked in-pool.',
      'RH open; no refereed bound is changed; NO QED. Measurement/analysis only, no Gram was rebuilt, no bound is claimed moved.',
    ],
    links: [],
  },
];

// Route I (Toeplitz/Krein certificate) uniform-N gap verdict, consolidating
// imp-96846 (route assessment), imp-96848 (partial tail-trace closure), and
// imp-96835 (2a-monotonicity cross-check) -- imp-96885.
const ROUTE_I_VERDICT = [
  {
    id: 'RouteI-1',
    tag: 'imp-96846-imp-96848-imp-96835-uniform-N-gap-consolidated',
    color: ED.series5,
    badge: 'ROUTE C MOST TRACTABLE; PARTIAL CLOSURE',
    title: 'Route I Krein uniform-N gap: complementary min-max methods are the tractable path; tail-trace bound partially closed',
    status: 'OPEN',
    body: [
      'imp-96835 cross-checked that the condB=1 Gegenbauer Rayleigh floor lambda_min(T_a[sigma_2]) is ' +
      'monotone-increasing as 2a decreases from ln3 to 0.96 (0.579988 at ln3 -> 20.132660 at 0.96, ' +
      'N=100, T=4800), so the 2a=ln3 plateau is the smallest/most binding floor in the certified-adjacent ' +
      'window and the imp-96651 positivity at 2a=0.96 is reproduced. But every tabulated floor is an ' +
      'N-Galerkin Rayleigh UPPER bound (Courant-Fischer), monotone DECREASING in N, so this in-basis ' +
      'monotonicity is necessary consistency, not operator positivity uniform in N (IMP96749_UNIFORM_N_GAP).',
      'imp-96846 assessed the three operator-theoretic routes that could deliver a genuine lower bound. ' +
      'Route A (Garding coercivity) is structurally incapable of a positive floor: it only reaches ' +
      'lambda_1 >= -C, C the mid-band dip depth. Route B (trace-class tail control) fails at the outset ' +
      'because T_a[sigma_2] is unbounded (order-4 symbol t^4 ln t), so its Galerkin tail is not trace-class; ' +
      'its only viable variant collapses onto the open (N,T) resolvent-truncation rate. Route C (min-max ' +
      'complementary: Temple / Kato-Temple / Lehmann-Goerisch) is the MOST TRACTABLE -- the only route that ' +
      'structurally produces lower bounds on lambda_1 with interval-friendly ingredients -- and reduces the ' +
      'whole problem to one missing input: a certified a-priori lower bound beta <= lambda_2(a).',
      'imp-96848 partially closes the companion tail-trace question Route B reduces to. The imp-96827 ' +
      'geometric-per-doubling decay law is NOT itself provable, but a strictly stronger structural bound ' +
      'replaces it needing no decay assumption: (A) the floor climbs monotonically because sigma_2 > 0 for ' +
      '|t| >= T0 ~ 17, so every truncation increment is a PSD Loewner slab (Weyl monotonicity); (B) a ' +
      'closed-form residual bound L - f(T) <= a^{-(4m+1)} (1/2pi) int_{|t|>T} sigma_2 |Psi|^2 dt follows from ' +
      'lambda_max(R_T) <= Tr(B^{-1} R_T). The enclosure becomes genuine once a single N-dependent tail-trace ' +
      'majorant on the Gegenbauer-transform diagonal is supplied (sub-gap IMP96848_TAILTRACE_MAJORANT) -- the ' +
      'named blocking step.',
      'STATUS UPDATE (imp-96876/imp-96888/imp-96973): that named blocking step is now closed off as a dead ' +
      'end, not a live path -- even a perfectly-assembled IMP96848_TAILTRACE_MAJORANT is ~3e15x (~15 orders) ' +
      'too loose at N=100, 2a=ln3, and the looseness is structural (baked into the bounding chain), not an ' +
      'un-computed constant. imp-96973 factorises the ~15-order gap as [sum-vs-single 1.9x] x [spectral-gap ' +
      '1.4e15x] x [trial-vector-slack 1.17x], correcting imp-96876s original attribution to the trace step ' +
      '(lambda_max(R_T) <= Tr(B^{-1} R_T), only ~1.9x) and localising nearly all of it in the spectral-gap ' +
      'step instead. Assembling the tail-trace majorant is therefore not worth pursuing; the productive ' +
      'successor is the per-mode Rayleigh/min-max bound <v0|R_T|v0> (IMP96888_RAYLEIGH_TAIL_MAJORANT, ' +
      'imp-96888), which is within 1.17-2.24x of the measured residual.',
      'None of these three results proves operator positivity; the interval-rigorous certified reach stays ' +
      '2a <= 0.96, IMP96749_UNIFORM_N_GAP_UNSETTLED remains open, RH is open, and no refereed bound is changed' +
      '. Assessment/measurement only; NO QED.',
    ],
    links: [],
  },
];

// kmax=5 Krein cutting-plane frontier: near-feasible double-precision solvability
// (imp-96845, imp-96868, imp-96881) vs. interval-CERTIFIED reach (imp-96956) -- imp-96979.
const KMAX5_FRONTIER_VERDICT = [
  {
    id: 'Kmax5Frontier-1',
    tag: 'imp-96845-imp-96868-imp-96881-imp-96956-near-feasible-vs-certified',
    color: TK_STATUS.nogo.fg,
    badge: 'NO CERTIFIED EXTENSION PAST 2a=0.96',
    title: 'kmax=5 Krein cutting-plane frontier: double-precision near-feasibility out to 2a~1.06 does NOT interval-verify',
    status: 'CLOSED (negative result)',
    body: [
      'imp-96845 measured a fresh kmax=5 cutting-plane LP as solvable and small-l1 out to 2a=1.06, where ' +
      'it walled at HiGHS status-4; imp-96868 tightened that wall band to (1.06, 1.07) and showed the ' +
      'binding double-precision residual is precision-invariant. Both results are DOUBLE-PRECISION ' +
      'NEAR-FEASIBLE iterates (a guarded design residual F-guard-eps with a small negative worst value), ' +
      'not interval-verified certificates (SUB-GAP IMP96845_KMAX5_NEAR_FEASIBLE_UNVERIFIED).',
      'imp-96956 tested that gap directly: it re-solved the kmax=5 LP at 2a=1.00 (strictly inside the ' +
      'double-precision solvable region, left of the 1.06-1.07 wall), reproducing the imp-96845 iterate ' +
      'exactly (l1=7.030242896554375, lean guarded residual -0.16636421527952594 near the T=40 tail), and ' +
      'ran it through the mpmath.iv prec-80 interval-rigorous verifier (20000 coarse cells, 45,703,181 fine ' +
      'points). IT COLLAPSED UNDER RIGOR: 226 cells failed with a rigorous lower bound below zero, worst ' +
      '-0.2709175966692893.',
      'The honest obstruction is INTERIOR (t~16.0-17.4, worst at t=16.6982) -- where the sigma_2 curvature ' +
      'and the t^5-family second-order between-grid guard bite -- not at the LP lean grid’s own worst point ' +
      '(t~30.77, near the tail). The t>=40 tail block verifies cleanly (bracket +0.458124). The pointwise ' +
      'F-value stays positive throughout (min ~+1), so the failure is entirely that the rigorous enclosure ' +
      'plus second-order guard cannot certify F>=0 across those 226 cells -- not an F<0 point value.',
      'Only the round-cap-stalled lean iterate (VIOLTOL=0.4, not converged) was tested at 2a=1.00, so ' +
      'whether a fully-converged or finer-grid kmax=5 iterate could interval-verify remains open ' +
      '(SUB-GAP IMP96956_CONVERGED_KMAX5_100_UNPRODUCED). As it stands, the kmax=5 near-feasible frontier ' +
      'gives NO interval-certified extension past 2a<=0.96. The certified reach is unchanged, operator ' +
      'positivity is not established (the Rayleigh floors remain upper bounds), RH is open, and ' +
      'no refereed bound is changed. NO QED.',
      'HONEST STATUS on the 226-cell collapse itself (imp-96978): a follow-up decomposition of the worst ' +
      'reported cell (t=16.697, rigorous lower bound -0.2706) found the negative bound is a COARSE-GRID ' +
      '(hc) guard-resolution artifact, not a genuine sign change -- the true point value there is +1.054, ' +
      'and shrinking the coarse cell width to hc<=1e-3 already flips that cell positive (+0.706), climbing ' +
      'to +1.053 by hc=2e-5. But imp-96978 measured ONLY that one worst cell in isolation; a full [0,40] ' +
      're-verification at hc<=1e-3 (2x the coarse cell count) that would actually CERTIFY 2a=1.00 was NOT ' +
      'run (SUB-GAP IMP96978_FULLDOMAIN_HC1EM3_RERUN_NOT_RUN). So 2a=1.00 certification is PENDING that ' +
      'rerun -- it is neither certified nor refuted by imp-96978 -- and the certified interval-rigorous ' +
      'reach stays 2a<=0.96 above. NO QED.',
    ],
    links: [],
  },
  {
    id: 'Kmax5Frontier-2',
    tag: 'imp-96970-imp-97012-imp-97050-celllocal-reproduction',
    color: ED.brass,
    badge: 'NUMERICAL REPRODUCTION, NOT A CERTIFIED REACH EXTENSION',
    title: 'kmax=5 cell-local 2a=1.00 VERIFIED verdict independently reproduced -- still not promoted to certified reach',
    status: 'OPEN (numerically verified once, not adversarially certified)',
    body: [
      'imp-96970 converged the kmax=5 solve at 2a=1.00 past the round-cap stall above; imp-97012 then ' +
      'swapped the constant W1PP=32.80 curvature bound for the imp-96992 cell-local |w1-prime-prime| ' +
      'enclosure. That single swap clears the full [0,40] domain: 0 failing cells (CERTIFICATE VERIFIED) ' +
      'versus 59 failing cells under the constant bound (deepest rigorous lower bound -0.954363556514616 ' +
      'at t~37.8) -- the pointwise F-value itself never changes, only which curvature bound the verifier ' +
      'is allowed to use.',
      'imp-97050 re-ran the identical cell-local pipeline through a from-scratch, independently-implemented ' +
      'interval-arithmetic library (not the project mpmath.iv verifier) and reproduced the same verdict: ' +
      '0 fails / VERIFIED for cell-local B, 59 fails / NOT VERIFIED for constant B, with the deepest bound ' +
      'matching to 10 significant figures (-0.954363556048962). This rules out a single-verifier bug -- the ' +
      'cell-local VERIFIED result at 2a=1.00 is a genuine, method-independent NUMERICAL reproduction.',
      'HONEST STATUS: a numerical reproduction across two independent implementations is not the same as a ' +
      'certified reach extension. Promoting 2a=1.00 requires (a) independent ADVERSARIAL re-verification of ' +
      'the cell-local enclosure’s soundness itself, not just cross-implementation agreement on its output, ' +
      'and (b) the separate interpretive step from a T_a[sigma_2]>=0 certificate to full operator/Weil ' +
      'positivity (the Rayleigh floors remain upper bounds). Until then the project’s certified reach stays ' +
      '2a<=0.96, from the Toeplitz T_a certificate route above -- a different path from this flow-positivity ' +
      'sweep. RH is open, no refereed bound is changed. NO QED.',
    ],
    links: [],
  },
];

// Route C-direct (Kato-Temple / Lehmann-Goerisch) for the Route I Krein floor:
// double obstruction from imp-96865 (certified-seed sign) and imp-96875
// (residual divergence), leaving only the bounded-resolvent path -- imp-96904.
const ROUTE_C_DOUBLE_BLOCK_VERDICT = [
  {
    id: 'RouteCDoubleBlock-1',
    tag: 'imp-96865-imp-96875-route-c-direct-doubly-blocked',
    color: ED.series1,
    badge: 'ROUTE C-DIRECT BLOCKED BOTH WAYS',
    title: 'Route C-direct (Kato-Temple / Lehmann-Goerisch) for lambda_1(T_a[sigma_2]) fails from the seed side AND the residual side',
    status: 'CLOSED (negative result)',
    body: [
      'imp-96846 named Route C (min-max complementary methods: Temple / Kato-Temple / Lehmann-Goerisch) ' +
      'the most tractable path to a genuine lower bound on the Route I Krein floor, reducing the whole ' +
      'problem to one missing input: a certified a-priori lower bound beta <= lambda_2(a) with beta > mu, ' +
      'mu ~ 0.5521 being the best measured Rayleigh upper bound at 2a=ln3.',
      'imp-96865 shows that CERTIFIED seed is unreachable by either exogenous mechanism. The classical ' +
      'Loewner base-problem seed forces beta_Loewner < 0, because any explicitly solvable comparison ' +
      'symbol c(t^2+1/4)^2 <= sigma_2(t) pointwise must use c <= min_t w_1(t) = -0.62758, a strictly ' +
      'negative constant. The Weyl bounded-perturbation split fares far worse: the sign-indefinite part ' +
      'of sigma_2 has operator norm |sigma_2^min| ~ 4336.2 at t~9.35, so beta_Weyl <= -4336.2, three-plus ' +
      'decades below mu. Both mechanisms fail the Kato-Temple hypothesis mu < beta before the residual leg ' +
      'is even reached.',
      'imp-96875 is the complementary result: GRANTING a positive, uncertified Ritz estimate of lambda_2 as ' +
      'a provisional seed (beta ~ 99-111, comfortably above mu) clears the seed-sign obstruction, but the ' +
      'residual ||Tg - mu g||^2 then diverges as the evaluation space grows (1.65e3 -> 2.60e4 as Nbig runs ' +
      '24..120 at fixed N=20) because the pole-free trial g lies in the operator’s form domain but not ' +
      'its operator domain (T_a[sigma_2] is unbounded, order-4 symbol t^4 ln t). The resulting Kato-Temple ' +
      'floor is ~-1e6, worsening with N.',
      'VERDICT: Route C-direct is doubly blocked -- no certified exogenous seed exists (imp-96865), and even ' +
      'a granted positive seed cannot survive the residual leg for the unbounded operator (imp-96875). The ' +
      'only remaining path is a BOUNDED shift-invert / resolvent reformulation (T+m)^{-1}, which collapses ' +
      'onto the open Route B (N,T) resolvent-truncation-rate envelope (imp-96827 / imp-96847 / imp-96848). ' +
      'IMP96749_UNIFORM_N_GAP_UNSETTLED remains open, the interval-rigorous certified reach stays 2a <= 0.96, ' +
      'RH is open, and no refereed bound is changed. NO operator positivity established; NO QED.',
    ],
    links: [],
  },
];

export default function OpenFrontierPage() {
  return (
    <div className="page">
      <PageHeader
        title="Open Frontier (archive)"
        subtitle="Archive of the T3 / Dyson / collision-flow lane and the R1, R2, G6a questions"
      />
      <SnapshotBanner date="2026-10-04">This page is an archive of one lane and is kept as written.</SnapshotBanner>

      <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            ARCHIVE PAGE — NOT THE LIVE FRONTIER
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: 0, lineHeight: 1.65 }}>
          The live frontier is{' '}
          <Link
            to="/frontier-dag"
            style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)' }}
          >
            /frontier-dag
          </Link>{' '}
          (asOf-stamped, one node per open object). This page is the archive of the
          Dyson / collision-flow lane and the R1 / R2 / G6a questions; its newest
          entries date from 2026-08. Nothing here is updated with the current
          frontier objects.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--brass-deco)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: 'var(--brass)',
              border: '1px solid var(--brass-deco)',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            CURRENT FRONTIER · CONTRACT, NOT A BOUND
          </span>
          <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>Λ ≤ 0.14 completion contract</code>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: 0, lineHeight: 1.65 }}>
          The strict Λ ≤ 0.14 statement is a conditional completion contract, not a
          proved bound: through the [B_v, Π_p] weld it is reduced to exactly one open
          correlated-enclosure family,{' '}
          <code style={{ fontSize: 12, color: 'var(--brass)' }}>
            |C_E,17| &lt; 0.2796881955526147 on 690988 ≤ N ≤ 54799999
          </code>
          . If that family fails to verify, the contract yields nothing. Full statement
          and status at{' '}
          <Link
            to="/permutation-architecture"
            style={{ fontSize: 13, color: 'var(--brass)', textDecoration: 'none', borderBottom: '1px solid var(--brass-deco)' }}
          >
            Permutation Architecture →
          </Link>
        </p>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '10px 0 0', lineHeight: 1.65 }}>
          The current reading of the T3 wall below: T3 is a zero-free-strip statement
          in disguise (verified dictionary), and the flow-blindness no-go shows no soft
          flow hypothesis can supply the missing arithmetic input — see{' '}
          <Link
            to="/flow-blindness-no-go"
            style={{ fontSize: 13, color: 'var(--brass)', textDecoration: 'none', borderBottom: '1px solid var(--brass-deco)' }}
          >
            Flow-Blindness No-Go →
          </Link>
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20, borderLeft: '4px solid var(--series-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: 'var(--series-5)',
              border: '1px solid var(--series-5)',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {SEAM_CHAIN_STATUS.status}
          </span>
        </div>
        <strong style={{ color: 'var(--ink)', fontSize: 14, display: 'block', marginBottom: 10 }}>
          {SEAM_CHAIN_STATUS.title}
        </strong>
        {SEAM_CHAIN_STATUS.body.map((para, i) => (
          <p key={i} style={{ fontSize: 13, color: 'var(--ink-faint)', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
            {para}
          </p>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid var(--rule)' }}>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: 0, lineHeight: 1.65 }}>
          The canonical global frontier is the exact T3 residual below. It is the
          current full-strength Twin Ladder formulation of RH and is not yet a
          simplification of RH. The R1, R2, and G6a questions remain useful
          research inside a distinct Dyson / collision-flow lane, but they are
          not the complete global gap and do not replace T3.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 22, borderLeft: '4px solid var(--series-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: 'var(--series-1)',
              border: '1px solid var(--series-1)',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            LATEST AUDITED CHECKPOINT
          </span>
          <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>T47–T198 · 2026-07-29</code>
        </div>
        <h2 style={{ color: 'var(--series-1)', fontSize: 15, margin: 0 }}>
          What the resumed Twin Ladder approach actually established
        </h2>
        <p style={{ color: 'var(--ink-faint)', fontSize: 12.5, lineHeight: 1.65, margin: '8px 0 12px' }}>
          These are proved identities, equivalences, and tail theorems together
          with explicitly labeled finite conjectural evidence. None supplies the
          missing arithmetic bound, and RH remains open.
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
                gridColumn: ['T160', 'T161', 'T162', 'T163', 'T164', 'T165', 'T166', 'T167', 'T168', 'T169', 'T170', 'T171', 'T172', 'T173', 'T174', 'T175', 'T176', 'T177', 'T178', 'T179', 'T180', 'T181', 'T182', 'T183', 'T184', 'T185', 'T186', 'T187', 'T188', 'T189', 'T190', 'T191', 'T192', 'T193', 'T194', 'T195', 'T196', 'T197', 'T198'].includes(item.id)
                  ? '1 / -1'
                  : undefined,
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
              <h3 style={{ color: 'var(--ink)', fontSize: 12.5, margin: '7px 0 0' }}>
                {item.title}
              </h3>
              <code
                style={{
                  display: 'block',
                  color: 'var(--ink-soft)',
                  fontSize: 10.5,
                  lineHeight: 1.5,
                  marginTop: 8,
                  padding: '7px 8px',
                  borderRadius: 5,
                  background: 'var(--paper-2)',
                  overflowX: 'auto',
                }}
              >
                {item.formula}
              </code>
              <p style={{ color: 'var(--ink-faint)', fontSize: 11.5, lineHeight: 1.55, margin: '8px 0 0' }}>
                {item.detail}
              </p>
              {item.certificate && (
                <code
                  style={{
                    display: 'block',
                    color: 'var(--ink-faint)',
                    fontSize: 9.5,
                    lineHeight: 1.45,
                    marginTop: 8,
                    overflowWrap: 'anywhere',
                  }}
                >
                  certificate · {item.certificate}
                </code>
              )}
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
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              borderRadius: 4,
              padding: '1px 6px',
            }}
          >
            {GLOBAL_FRONTIER.status}
          </span>
          <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{GLOBAL_FRONTIER.tag}</code>
        </div>
        <strong style={{ color: 'var(--ink)', fontSize: 15, display: 'block', marginBottom: 10 }}>
          {GLOBAL_FRONTIER.title}
        </strong>
        <div
          style={{
            marginBottom: 12,
            padding: '10px 12px',
            borderRadius: 6,
            background: 'color-mix(in srgb, var(--series-2) 7%, transparent)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 13,
            overflowX: 'auto',
          }}
        >
          D<sub>a,R</sub> + K<sub>a</sub><sup>(S)</sup> ⪰ −K<sub>a,0</sub>
        </div>
        {GLOBAL_FRONTIER.body.map((para, i) => (
          <p key={i} style={{ fontSize: 13, color: 'var(--ink-faint)', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
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
        style={{ marginBottom: 22, borderLeft: '4px solid var(--brass-deco)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: 'var(--brass)',
              border: '1px solid var(--brass-deco)',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.status}
          </span>
          <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>T11 · exact Riemann kernel</code>
        </div>
        <strong style={{ color: 'var(--brass)', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {CHANNEL_SPLIT_CERTIFICATE.title}
        </strong>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
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
                background: 'color-mix(in srgb, var(--brass-deco) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--brass-deco) 25%, transparent)',
                color: 'var(--brass)',
                fontSize: 12,
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: 'var(--ink-faint)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
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
        <p style={{ color: 'var(--ink-faint)', fontSize: 13, lineHeight: 1.65, margin: '10px 0 0' }}>
          {CHANNEL_SPLIT_CERTIFICATE.coupledTarget}
        </p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 11.5, lineHeight: 1.55, margin: '10px 0 0' }}>
          Certificate method: {CHANNEL_SPLIT_CERTIFICATE.method}.
        </p>
        <div
          style={{
            marginTop: 14,
            padding: '12px 14px',
            borderRadius: 7,
            background: 'color-mix(in srgb, var(--series-1) 6%, transparent)',
            border: '1px solid color-mix(in srgb, var(--series-1) 22%, transparent)',
          }}
        >
          <strong style={{ color: 'var(--series-1)', fontSize: 13 }}>
            Confluent derivative-jet refinement
          </strong>
          <p style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.65, margin: '8px 0 0' }}>
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
              color: 'var(--series-1)',
              background: 'color-mix(in srgb, var(--series-1) 8%, transparent)',
              fontSize: 11.5,
              overflowX: 'auto',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.jetOrder2Rescue}
          </code>
          <p style={{ color: 'var(--ink-faint)', fontSize: 12.5, lineHeight: 1.65, margin: '9px 0 0' }}>
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
              color: 'var(--series-1)',
              background: 'color-mix(in srgb, var(--series-1) 8%, transparent)',
              fontSize: 11.5,
              overflowX: 'auto',
            }}
          >
            {CHANNEL_SPLIT_CERTIFICATE.jetOrder4Rescue}
          </code>
          <p style={{ color: 'var(--ink-faint)', fontSize: 11.5, lineHeight: 1.55, margin: '9px 0 0' }}>
            This refutes discarding that positive radial component before
            estimating the negative component. It is not a universal statement
            about every radial split and does not prove T3 or RH. Certificate
            method: {CHANNEL_SPLIT_CERTIFICATE.jetMethod}.
          </p>
        </div>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: '4px solid var(--series-5)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: 'var(--series-5)',
              border: '1px solid var(--series-5)',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {ONE_POINT_JET_HIERARCHY.status}
          </span>
          <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>T13–T15 · full coupled kernel</code>
        </div>
        <strong style={{ color: 'var(--series-5)', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {ONE_POINT_JET_HIERARCHY.title}
        </strong>
        <p style={{ color: 'var(--ink-faint)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
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
                background: 'color-mix(in srgb, var(--series-5) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--series-5) 25%, transparent)',
                color: 'var(--series-5)',
                fontSize: 11.5,
                overflowX: 'auto',
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: 'var(--series-5)', fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
          {ONE_POINT_JET_HIERARCHY.finiteWarning}
        </p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 11.5, lineHeight: 1.55, margin: '9px 0 0' }}>
          A single fixed-a hierarchy may also be weaker than strict
          Hermite–Biehler positivity when shifted zeros cancel. The exact
          RH-equivalent obligation remains the all-order hierarchy along
          thicknesses tending to zero; neither the current finite certificates
          nor this reformulation proves RH.
        </p>
      </div>

      <div
        className="card"
        style={{ marginBottom: 22, borderLeft: '4px solid var(--series-3)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: 0.45,
              color: 'var(--series-3)',
              border: '1px solid var(--series-3)',
              borderRadius: 4,
              padding: '2px 7px',
            }}
          >
            {MARKOV_NORMALIZATION.status}
          </span>
          <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>T18–T198 · Markov / divisor / explicit-formula frontier</code>
        </div>
        <strong style={{ color: 'var(--series-3)', fontSize: 15, display: 'block', marginBottom: 8 }}>
          {MARKOV_NORMALIZATION.title}
        </strong>
        <p style={{ color: 'var(--ink-faint)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>
          {MARKOV_NORMALIZATION.structure}{' '}
          {MARKOV_NORMALIZATION.structureT122}{' '}
          {MARKOV_NORMALIZATION.structureT123}{' '}
          {MARKOV_NORMALIZATION.structureT124}{' '}
          {MARKOV_NORMALIZATION.structureT125}{' '}
          {MARKOV_NORMALIZATION.structureT126}{' '}
          {MARKOV_NORMALIZATION.structureT127}{' '}
          {MARKOV_NORMALIZATION.structureT128}{' '}
          {MARKOV_NORMALIZATION.structureT129}{' '}
          {MARKOV_NORMALIZATION.structureT130}{' '}
          {MARKOV_NORMALIZATION.structureT131}{' '}
          {MARKOV_NORMALIZATION.structureT132}{' '}
          {MARKOV_NORMALIZATION.structureT133}{' '}
          {MARKOV_NORMALIZATION.structureT134}{' '}
          {MARKOV_NORMALIZATION.structureT135}{' '}
          {MARKOV_NORMALIZATION.structureT136}{' '}
          {MARKOV_NORMALIZATION.structureT137}{' '}
          {MARKOV_NORMALIZATION.structureT138}
          {' '}{MARKOV_NORMALIZATION.structureT139}{' '}
          {MARKOV_NORMALIZATION.structureT140}{' '}
          {MARKOV_NORMALIZATION.structureT141}{' '}
          {MARKOV_NORMALIZATION.structureT142}{' '}
          {MARKOV_NORMALIZATION.structureT143}{' '}
          {MARKOV_NORMALIZATION.structureT144}{' '}
          {MARKOV_NORMALIZATION.structureT145}{' '}
          {MARKOV_NORMALIZATION.structureT146}{' '}
          {MARKOV_NORMALIZATION.structureT147}{' '}
          {MARKOV_NORMALIZATION.structureT148}{' '}
          {MARKOV_NORMALIZATION.structureT149}{' '}
          {MARKOV_NORMALIZATION.structureT150}{' '}
          {MARKOV_NORMALIZATION.structureT151}{' '}
          {MARKOV_NORMALIZATION.structureT152}{' '}
          {MARKOV_NORMALIZATION.structureT153}{' '}
          {MARKOV_NORMALIZATION.structureT154}{' '}
          {MARKOV_NORMALIZATION.structureT155}{' '}
          {MARKOV_NORMALIZATION.structureT156}{' '}
          {MARKOV_NORMALIZATION.structureT157}{' '}
          {MARKOV_NORMALIZATION.structureT158}{' '}
          {MARKOV_NORMALIZATION.structureT159}{' '}
          {MARKOV_NORMALIZATION.structureT160}{' '}
          {MARKOV_NORMALIZATION.structureT161}{' '}
          {MARKOV_NORMALIZATION.structureT162}{' '}
          {MARKOV_NORMALIZATION.structureT163}{' '}
          {MARKOV_NORMALIZATION.structureT164}{' '}
          {MARKOV_NORMALIZATION.structureT165}{' '}
          {MARKOV_NORMALIZATION.structureT166}{' '}
          {MARKOV_NORMALIZATION.structureT167}{' '}
          {MARKOV_NORMALIZATION.structureT168}{' '}
          {MARKOV_NORMALIZATION.structureT169}{' '}
          {MARKOV_NORMALIZATION.structureT170}{' '}
          {MARKOV_NORMALIZATION.structureT171}{' '}
          {MARKOV_NORMALIZATION.structureT172}{' '}
          {MARKOV_NORMALIZATION.structureT173}{' '}
          {MARKOV_NORMALIZATION.structureT174}{' '}
          {MARKOV_NORMALIZATION.structureT175}{' '}
          {MARKOV_NORMALIZATION.structureT176}{' '}
          {MARKOV_NORMALIZATION.structureT177}{' '}
          {MARKOV_NORMALIZATION.structureT178}{' '}
          {MARKOV_NORMALIZATION.structureT179}{' '}
          {MARKOV_NORMALIZATION.structureT180}{' '}
          {MARKOV_NORMALIZATION.structureT181}{' '}
          {MARKOV_NORMALIZATION.structureT182}{' '}
          {MARKOV_NORMALIZATION.structureT183}{' '}
          {MARKOV_NORMALIZATION.structureT184}{' '}
          {MARKOV_NORMALIZATION.structureT185}{' '}
          {MARKOV_NORMALIZATION.structureT186}{' '}
          {MARKOV_NORMALIZATION.structureT187}{' '}
          {MARKOV_NORMALIZATION.structureT188}{' '}
          {MARKOV_NORMALIZATION.structureT189}{' '}
          {MARKOV_NORMALIZATION.structureT190}{' '}
          {MARKOV_NORMALIZATION.structureT191}{' '}
          {MARKOV_NORMALIZATION.structureT192}{' '}
          {MARKOV_NORMALIZATION.structureT193}{' '}
          {MARKOV_NORMALIZATION.structureT194}{' '}
          {MARKOV_NORMALIZATION.structureT195}{' '}
          {MARKOV_NORMALIZATION.structureT196}{' '}
          {MARKOV_NORMALIZATION.structureT197}{' '}
          {MARKOV_NORMALIZATION.structureT198}
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
            MARKOV_NORMALIZATION.adaptiveCompleteZeroWave,
            MARKOV_NORMALIZATION.primeJumpAbel,
            MARKOV_NORMALIZATION.criticalCumulativeBuffer,
            MARKOV_NORMALIZATION.terminalBufferDrawdown,
            MARKOV_NORMALIZATION.jointInteriorBuffer,
            MARKOV_NORMALIZATION.singleInteriorBand,
            MARKOV_NORMALIZATION.singleInteriorRecurrence,
            MARKOV_NORMALIZATION.powerCumulativeBand,
            MARKOV_NORMALIZATION.movingHeatGap,
            MARKOV_NORMALIZATION.verifiedHeightHeat,
            MARKOV_NORMALIZATION.infiniteZeroAdaptiveNotch,
            MARKOV_NORMALIZATION.terminalBoundaryRectangles,
            MARKOV_NORMALIZATION.explicitPhaseReversal,
            MARKOV_NORMALIZATION.recurrentBracketedIsland,
            MARKOV_NORMALIZATION.selfSimilarRadixObstruction,
            MARKOV_NORMALIZATION.uniformNegativePhaseInterval,
            MARKOV_NORMALIZATION.wholeBlockAggregate,
            MARKOV_NORMALIZATION.exactMellinRigidity,
            MARKOV_NORMALIZATION.fixedBlockBlindLattice,
            MARKOV_NORMALIZATION.fixedMeasureBlindPoints,
            MARKOV_NORMALIZATION.fixedMovingMeasureBlindRectangle,
            MARKOV_NORMALIZATION.adaptiveAlgebraicPrefix,
            MARKOV_NORMALIZATION.adaptivePrefixRecurrence,
            MARKOV_NORMALIZATION.adaptiveNaturalScaleFloor,
            MARKOV_NORMALIZATION.adaptivePrimePowerCompletedDrift,
            MARKOV_NORMALIZATION.adaptiveFiveBandAbel,
            MARKOV_NORMALIZATION.adaptivePositiveLocalFilterNoGo,
            MARKOV_NORMALIZATION.adaptiveDefectCurvature,
            MARKOV_NORMALIZATION.adaptiveMicrocellComparator,
            MARKOV_NORMALIZATION.adaptiveFixedDepthComposition,
            MARKOV_NORMALIZATION.adaptiveAdjacentDepthDeconvolution,
            MARKOV_NORMALIZATION.adaptiveFiniteOverlapOscillation,
            MARKOV_NORMALIZATION.adaptiveSummableInfiniteOverlap,
            MARKOV_NORMALIZATION.adaptiveSubcriticalProfileDrift,
            MARKOV_NORMALIZATION.adaptiveExactDualCost,
            MARKOV_NORMALIZATION.adaptivePeriodicControllerNoGo,
            MARKOV_NORMALIZATION.adaptiveLowDiscrepancyNoGo,
            MARKOV_NORMALIZATION.adaptiveIndependentRandomNoGo,
            MARKOV_NORMALIZATION.adaptiveMarkovControllerNoGo,
            MARKOV_NORMALIZATION.adaptiveNonhomogeneousMixingNoGo,
            MARKOV_NORMALIZATION.adaptivePredictableMarginalBudget,
            MARKOV_NORMALIZATION.adaptiveSquarefreeStateNoGo,
            MARKOV_NORMALIZATION.adaptiveSummableDivisorStateNoGo,
            MARKOV_NORMALIZATION.adaptiveLogMomentDivisorStateNoGo,
            MARKOV_NORMALIZATION.adaptiveCriticalSparsePrimeCorrelation,
            MARKOV_NORMALIZATION.adaptiveFiniteZeroPacketDecorrelation,
            MARKOV_NORMALIZATION.adaptiveNaturalDensityLargeSieveNoGo,
            MARKOV_NORMALIZATION.adaptiveNaturalDensityInfiniteProfileNoGo,
            MARKOV_NORMALIZATION.adaptiveBanachMeanProfileNoGo,
            MARKOV_NORMALIZATION.adaptiveNondensityHydrodynamicLimit,
            MARKOV_NORMALIZATION.adaptiveLogPeriodicResonance,
            MARKOV_NORMALIZATION.adaptiveBinaryLogBlockResonance,
            MARKOV_NORMALIZATION.adaptiveResonantBlockDesign,
            MARKOV_NORMALIZATION.adaptiveResonantPairRayleigh,
            MARKOV_NORMALIZATION.adaptiveCertifiedResonantEnvelope,
            MARKOV_NORMALIZATION.adaptiveTwoProfileResonantRobustness,
            MARKOV_NORMALIZATION.adaptiveUnconditionalAggregateTransform,
            MARKOV_NORMALIZATION.adaptiveAsymptoticOddResonance,
            MARKOV_NORMALIZATION.adaptiveTwoPeriodNoGain,
            MARKOV_NORMALIZATION.adaptiveDepthProbeCollisionVisibility,
            MARKOV_NORMALIZATION.adaptiveGenericGeometricProfile,
            MARKOV_NORMALIZATION.adaptiveFiniteSpectrumCriterion,
            MARKOV_NORMALIZATION.adaptiveThreeDepthCriterion,
            MARKOV_NORMALIZATION.adaptiveGenericFiniteProfile,
            MARKOV_NORMALIZATION.adaptiveOneParameterFiniteProfile,
            MARKOV_NORMALIZATION.adaptiveUniformMultiplierBlindSpot,
            MARKOV_NORMALIZATION.adaptiveDepth12BranchEscape,
            MARKOV_NORMALIZATION.adaptiveDepth12LowBlindSpot,
            MARKOV_NORMALIZATION.adaptiveDilationAlignedNoGain,
            MARKOV_NORMALIZATION.finiteModes,
            MARKOV_NORMALIZATION.gaussian,
            MARKOV_NORMALIZATION.finiteOrderSmoothing,
            MARKOV_NORMALIZATION.cellQuotient,
            MARKOV_NORMALIZATION.gradedBackward,
            MARKOV_NORMALIZATION.finiteRadialLayers,
            MARKOV_NORMALIZATION.lowerEdgeTail,
            MARKOV_NORMALIZATION.twoBranchHalfSech,
            MARKOV_NORMALIZATION.endpointOnlyNoGo,
            MARKOV_NORMALIZATION.exactBoundaryRescue,
            MARKOV_NORMALIZATION.exactBoundaryJet,
            MARKOV_NORMALIZATION.boundaryEnergyHierarchy,
            MARKOV_NORMALIZATION.infinitesimalBoundaryJet,
            MARKOV_NORMALIZATION.infinitesimalHierarchy,
            MARKOV_NORMALIZATION.infinitesimalJetFloor,
            MARKOV_NORMALIZATION.translationParityMargin,
            MARKOV_NORMALIZATION.translationMixtureKernel,
            MARKOV_NORMALIZATION.squareConcavityMixtureCounterexample,
            MARKOV_NORMALIZATION.twoPacketConcavityTheorem,
            MARKOV_NORMALIZATION.localFivePacketProtection,
            MARKOV_NORMALIZATION.localSeventeenPacketProtection,
            MARKOV_NORMALIZATION.canonicalTruncationNoGo,
            MARKOV_NORMALIZATION.translationFixedOrderTail,
            MARKOV_NORMALIZATION.translationThreePacketCompactness,
            MARKOV_NORMALIZATION.translationTripleCollisionFirstSegment,
            MARKOV_NORMALIZATION.translationTripleCollisionComplete,
            MARKOV_NORMALIZATION.translationThreePacketOriginSlice,
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
                background: 'color-mix(in srgb, var(--series-6) 8%, transparent)',
                border: '1px solid color-mix(in srgb, var(--series-6) 25%, transparent)',
                color: 'var(--series-3)',
                fontSize: 11.5,
                overflowX: 'auto',
              }}
            >
              {value}
            </code>
          ))}
        </div>
        <p style={{ color: 'var(--series-3)', fontSize: 12.5, lineHeight: 1.65, margin: 0 }}>
          {MARKOV_NORMALIZATION.routeAudit}
        </p>
        <p style={{ color: 'var(--ink-faint)', fontSize: 11.5, lineHeight: 1.55, margin: '9px 0 0' }}>
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
          125 and 126 keep the qualifier “eventually” essential.
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
          leading floored responses, while remaining RH-equivalent;
          the notch multiplier does
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
          T107 removes that fixed-mode qualifier for every nonzero
          fixed finite square-notched channel. On RH its normalized
          output is asymptotic to a nonzero mean-zero almost-periodic
          zeta wave, and any arbitrary k-dependent real mass-one
          local postfilter with δ+τ&lt;1 remains asymptotically the
          identity on the whole unnormalized output.
          Both signs therefore recur at full k<sup>3/2</sup> scale.
          The theorem does not cover the positive-biased T101 buffer,
          critical conditioning, adaptive multiplicative or
          infinite-scale filters, or global nonlinear control.
          T108 returns to that positive buffer and gives its exact
          prime-jump Abel form: the sign is a compensated difference
          of floor-aligned geometric-block means of θ(x)−x, exactly
          adjacent when s divides k, with normalized compensation
          ½log(r/s)+O(1/k). The exact mean inequality is still
          RH-equivalent, and prime jumps force curvature flips that
          rule out eventual convexity or concavity of log K_u.
          This is a sharper arithmetic target, not its proof.
          T109 then applies the critical N<sup>−5/2</sup> damping
          across one fixed residue lane. The resulting global
          positive-kernel cumulative has unconditional logarithmic
          positive limsup, but Landau makes even a fixed tail lower
          bound equivalent to RH. False RH would force unbounded
          negative excursions, and fixed-order Riesz smoothing keeps
          the same poles. No such lower bound is proved.
          T110 returns to one complete buffer and asks whether it
          absorbs every ordered negative prefix before its terminal
          endpoint. The exact quantity is
          Λ(k,u)=F(k)+Σ<sub>k≤h&lt;u</sub>q(h), with endpoints F(k)
          and 2F(k), and its prime-jump kernel is the sum of two
          nonnegative trapezoids. RH proves its sign only in
          o(k/log<sup>2</sup>k) boundary layers by the current
          estimates. The original segmented floating-point scan through
          k=10,000,000 found no nonpositive F or Λ for either ratio,
          despite 3,859,528 and 4,486,170 numerically observed
          negative-prefix rows. T118 extended both pairs through
          k=100,000,000 with no nonpositive F or Λ, and the replayed
          global ratio records, 0.2283912… and 0.2510143…, were
          unchanged. This is still finite evidence, not an interval or
          eventual proof.
          T111 then isolates two strictly interior samples per ratio.
          The pairs (15N,21N),(15N,22N) and
          (21N,30N),(21N,31N) are each jointly RH-equivalent:
          their distinct multipliers have no common zero for
          Re z&gt;1, while rigorous first-1,000-zero normalized margins are
          0.08175619…, 0.08065668…, 0.07182940…, and 0.05663867….
          This removes endpoint sampling but does not prove either
          paired inequality unconditionally or settle the full
          proportional-width T110 conjecture.
          T112 then cancels the common terminal buffer between two
          strict interior samples at outer row 24N. The resulting
          39/25 band is a single RH-equivalent product comparison on
          [625N,1326N], with nonnegative plateau-trapezoid kernel and
          multiplier zeros only on Re z=0 or 1. A rigorous first-10,000-zero
          Arb/Turing budget gives normalized margin 0.00072668057… and
          restored margin 283.85959789…N<sup>3/2</sup>. Its support
          ratio 1326/625=2.1216 improves T96, but the eventual product
          sign itself remains open.
          T113 proves a strong unconditional recurrence for that exact
          product: its real prime-square residue is
          B<sub>Δ</sub>=59279.380606…, and for every smaller margin
          infinitely many whole blocks of length
          √N exp(0.8√log N) satisfy the product inequality exponentially
          deeply. Exact local, valuation, pairwise, and canonical
          prime-jump fixed-step kernel audits rule out the direct
          termwise and divisibility shortcuts. The block starts may
          remain arbitrarily sparse.
          T114 then sums the same exact band over every fixed power
          weight N<sup>−α</sup>, α≤5/2. With
          κ=5/2−α, the prime-square pole moves to w=κ and every
          off-line zero moves to w=κ+ρ−1/2. Thus even the
          natural-scale floor ℒ<sub>α</sub>(X)≥−CX<sup>κ</sup>
          would prove RH, while unconditionally
          limsup ℒ<sub>α</sub>/G<sub>κ</sub>≥59279.380606….
          The exact q-incidence is nonnegative but nonmonotone,
          the K coefficients still have both signs, and fixed-order
          Riesz smoothing removes no pole. No such floor is known.
          T115 then changes the scale of the smoothing itself. Its
          positive log-Gaussian has variance proportional to log X,
          preserves the real prime-square residue, and suppresses every
          nonreal Mellin mode. A fixed finite contour proves that the
          normalized average tends unconditionally to
          B<sub>Δ</sub>=59279.380606…. Sharp tail control then forces
          one N in every sufficiently large interval
          [Y,Y<sup>29/25</sup>] with
          Δ<sub>N</sub>&gt;(B<sub>Δ</sub>−ε)N<sup>3/2</sup>.
          This removes arbitrary power-size gaps between deep wins, but
          it does not prove all N: the moving filter also suppresses
          hypothetical off-line zeros.
          T116 spends the full verified height
          H=3,000,175,332,800 in the same heat response. The exact
          exponent falls to
          θ<sub>H</sub>=6000350665601/6000350665597
          =1.0000000000006666277…. For every fixed
          0&lt;ε&lt;B<sub>Δ</sub>, every sufficiently large
          [Y,Y<sup>θH</sup>] now contains a whole consecutive block of
          √N exp(0.8√log N) deep wins, and their counting function has
          lower logarithmic exponent at least
          0.4999999999996666861…. The selected contour lies above
          6.00×10<sup>12</sup>, so the threshold is existential and
          extremely ineffective. This still gives no relative-gap,
          positive-density, or eventual-sign theorem.
          T117 tests the complementary fixed infinite filter. A
          positive Rademacher cascade built from the ordinates actually
          on the critical line cancels their complete leading wave,
          preserves B<sub>Δ</sub>, and has no multiplier zero off the
          imaginary axis. Its normalized output tends to
          B<sub>Δ</sub> on RH, but even a lower floor of order
          x<sup>3/2</sup> is RH-equivalent. False RH would force
          normalized liminf −∞. The filter is mathematically valid but
          zero-adaptive and non-effective; it uses infinitely many
          scales and has no finite radical/product form. It classifies the
          infinite-notch loophole without proving an arithmetic sign.
          T118 returns to the ordered arithmetic buffer. On infinitely
          many consecutive deep row blocks, every row is positive
          throughout two endpoint layers of width
          √k exp(0.8476836√log k)/(log k)<sup>2</sup>. The
          proportional-width middle remains uncontrolled. At
          μ=113/105, the first 1,000 critical-mode absolute costs
          already exceed the square bias by more than 9/200, so the
          selected-channel triangle-inequality proof cannot be made
          uniform across that middle.
          T119 supplies the missing phase-sensitive conclusion for the
          stronger all-prefix conjecture. At
          (k,u,e<sub>k</sub>)=(105N,113N,160N), a 1,152-bit Arb
          certificate encloses an explicit first-10,000-zero wave at
          −0.251561551266345…, against positive square bias
          0.237544635537161… and complete residual tail at most
          0.004583969610754…. The resulting RH-side upper bound is
          −0.009432946118431…&lt;−9/1000. Exact Turing counting
          proves the low-zero list complete, and finite-polynomial
          almost-periodic recurrence transfers the strict sign to
          infinitely many integer N without a linear-independence
          assumption. If RH is false, the endpoint equivalence instead
          forces infinitely many negative values at u=k. Thus eventual
          all-u positivity is unconditionally false. Exact opposite-sign
          valuations across all 17 aligned middle channels separately
          rule out same-prime divisibility in either direction.
          This refutes a stronger conjecture; it does not settle RH.
          T120 resolves the shape of that same RH-side phase. Complete
          residual-tail bounds give W<sub>1</sub>&gt;47/1000 and
          W<sub>106/105</sub>&gt;9/250, while
          W<sub>113/105</sub>&lt;−9/1000. T111 gives
          W<sub>30/21</sub>&gt;1/20 at every phase, and exactly
          W<sub>32/21</sub>=2W<sub>1</sub>. Joint almost-periodic
          recurrence therefore produces infinitely many RH-conditional
          rows with signs (+,+,−,+,+) at
          u=(105,106,113,150,160)N. Each row has a down-crossing
          between 106N and 113N and an up-crossing between 113N and
          150N: a bracketed negative island, not a new RH criterion.
          T121 returns to the T112 comparator and rules out its natural
          monotone transport proof unconditionally. The positive
          cross-prime quotient and its residual have opposite
          ±(9,643,725/2)N<sup>2</sup> leading terms, so the apparent
          payment cancels before the N<sup>3/2</sup> square layer.
          Exact balanced-tail witnesses of both signs repeat in every
          reciprocal shell, and at N=18 the threshold
          K<sub>u</sub>≥2<sup>154</sup> has 155600 upper versus
          155727 lower factors, a Hall deficit of 127. This excludes
          equal-or-larger monotone prime/factor matching, but it neither
          signs the T112 product nor decides RH.
          T122 strengthens the T119 point phase to three nested
          continuous intervals. A full 1,152-bit, first-10,000-zero
          certificate with exact Turing counting proves
          W<sub>μ</sub>(t<sub>*</sub>)&lt;−10<sup>−6</sup> when
          |μ−113/105|≤1/64, &lt;−1/1000 when |μ−113/105|≤1/72,
          and &lt;−1/200 when |μ−113/105|≤1/128. Five disjoint
          adaptive rational subdivisions reevaluate the selected wave
          at exact cell midpoints and charge the derivative only across
          each cell, with the full residual Hadamard tail included.
          They use 649 cell evaluations and 327 certified leaves with
          zero failures, so these are continuum bounds, not a finite
          grid inference. Under RH, function-valued almost-periodic
          recurrence therefore gives infinitely many common rows with
          nested negative blocks
          A<sub>d,N</sub>=113N−⌊105N/d⌋ through
          B<sub>d,N</sub>=113N+⌊105N/d⌋ for d=64,72,128.
          With k=105N, the blocks contain k/32+O(1), k/36+O(1),
          and k/64+O(1) consecutive prefixes. Their negative-area
          coefficients are respectively 21/6400000, 7/2400, and
          21/2560 times ND<sub>N</sub>, where
          D<sub>N</sub>=21<sup>5/2</sup>(105N)<sup>3/2</sup>.
          The widest block separates its bounding sign changes by
          k/32+O(1), while the deepest margin forces total variation
          at least (151/1000−o(1))D<sub>N</sub> on [105N,160N],
          together with Ω(N/log<sup>2</sup>N) increments of each sign.
          These conclusions are RH-conditional; they produce no
          unconditional contradiction and neither prove nor disprove RH.
          T123 now multiplies every prefix in one such symmetric block.
          With G<sub>M</sub>=B<sub>M</sub>/P<sub>M</sub>
          =∏<sub>v&lt;M</sub>K<sub>v</sub>, the exact product
          Y<sub>N,δ</sub>=exp(Σ<sub>u=A_N</sub>
          <sup>B_N</sup>Λ<sub>32,21</sub>(105N,u))
          is a finite factorial, prime-power, and K<sub>v</sub> ballot.
          A shifted Mellin/Landau argument forces
          limsup log Y<sub>N,δ</sub>/N<sup>5/2</sup>≥𝔅<sub>δ</sub>
          &gt;0 unconditionally, so Y<sub>N,δ</sub>&gt;1
          infinitely often. For δ=1/128, RH and the T122 deep interval
          also force log Y<sub>N,δ</sub>≤
          −(21/2560−o(1))ND<sub>N</sub>&lt;0 infinitely often.
          Under RH the exact aggregate therefore takes both strict signs
          around one; that is sign recurrence, not a contradiction.
          Its averaged multiplier has a blind lattice
          z<sub>n</sub>=log 2/log(32/21)+2πin/log(32/21)+O(1/n),
          with real parts tending to 1.645595…&gt;3/2. This blocks only
          the standard zero-free-multiplier/Landau converse: it neither
          asserts a matching zeta zero nor proves that a different RH
          equivalence is impossible. At N=128, exact values
          v<sub>2</sub>(Y)=3544370084&gt;0 and
          v<sub>5</sub>(Y)=−9274951931&lt;0 rule out divisibility in
          both orientations. The exact prime/composite curvature switch
          separately rules out global convexity, concavity, and a direct
          Jensen proof. Neither arithmetic no-go determines the real sign.
          T124 then classifies two formal adaptive and nonlinear escape
          routes. Let ν<sub>τ</sub> be finite positive log-scale measures
          sharing one open exponential-moment strip. If
          R<sub>τ</sub>(w)=∫e<sup>wy</sup>dν<sub>τ</sub>(y) is independent
          of τ on a set with a limit point inside that strip, the identity
          theorem and Fourier-transform uniqueness force every
          ν<sub>τ</sub> to equal one fixed measure. An exact fixed
          open-strip scalar response therefore cannot be genuinely
          scale-adaptive. Separately, apply a continuous nonnegative
          degree-d homogeneous rule Φ to finitely many channels of one
          conjugate pure mode. The result is
          x<sup>dσ</sup>h(log x), with h periodic and nonnegative. Either
          h vanishes on the entire phase orbit, or its mean is positive and
          the Mellin transform has a simple real pole at s=dσ with positive
          residue. For a scalar amplitude A, positive part, absolute value,
          and square have residues A/π, 2A/π, and A<sup>2</sup>/2.
          This supplies the real singularity required by Landau rather
          than contradicting the mode. Agreement only at discrete zeta
          zeros, variable symbols, full multi-mode waves, adaptive
          nonlinearities, and genuinely global arithmetic transforms lie
          outside T124. It proves neither RH nor that another RH
          equivalence is impossible.
          T125 asks whether a smoother fixed block weighting removes
          T123’s blind lattice. For one fixed density
          ϖ∈L<sup>1</sup>([α,β]), compact-uniform
          Riemann–Lebesgue decay and Rouché’s theorem give one simple zero
          z<sub>n</sub>=log 2/log a+2πin/log a+o<sub>ϖ</sub>(1)
          near every high base-lattice point. At a=32/21 its real part
          remains above 3/2 eventually. Bare L<sup>1</sup> supplies no
          O(1/|n|) rate, while bounded variation in log μ does. Exact
          integer-multiplicity prefix products have normalized atomic
          measures ν<sub>N</sub> and the response
          Q<sub>N,m</sub>(z)=21<sup>z+1</sup>(105N)<sup>z</sup>
          M<sub>N</sub>(a<sup>z</sup>−a)
          {'{'}a<sup>z</sup>−2+∫μ<sup>z</sup>dν<sub>N</sub>(μ){'}'}.
          Weak convergence on the fixed prefix interval recovers the
          continuous symbol only in the N→∞ then |n|→∞ order. Finite
          atomic responses need not decay vertically, and T123’s
          O(N<sup>2</sup>) Mellin transfer does not automatically carry
          over. Thus fixed absolutely continuous smoothing cannot cure
          this blind lattice, while atomic, singular, scale-adaptive, and
          fully discrete strategies remain outside.
          T126 extends right-half zero existence to fixed atomic and
          singular measures, at a weaker level of localization. It does
          not by itself close every Landau route available to those
          weights. For any fixed finite complex
          Borel measure ν with
          supp|ν|⊂[α,β]⊂⊂(1,a), the symbol
          ℬ<sub>ν</sub>(z)=a<sup>z</sup>−2+
          ∫μ<sup>z</sup>dν(μ) has infinitely many zeros in every
          half-plane Re z&gt;c with
          c&lt;σ<sub>*</sub>=log 2/log a. No positivity or normalization
          is required, and at a=32/21 this gives infinitely many blind
          points with real part above 3/2. The proof applies Jessen
          convexity to the analytic almost-periodic atomic symbol, then
          uses a continuous Wiener mean-square estimate and Rouché
          comparisons to transfer its positive-density almost periods
          past the atomless remainder.
          The localization hierarchy depends on regularity: an
          L<sup>1</sup> density has one simple zero near every sufficiently
          high base-lattice point; an atomless measure retains a
          subsequence z<sub>n_j</sub>=ζ<sub>n_j</sub>+o(1); a general
          measure has infinitely many right-half zeros but no universal
          lattice or rate. A positive atomic probability measure has
          positive vertical zero density strictly right of
          σ<sub>*</sub>. For ν=δ<sub>√a</sub>, the exact factorization
          ℬ<sub>ν</sub>=(a<sup>z/2</sup>−1)
          (a<sup>z/2</sup>+2) puts the second family on
          Re z=2σ<sub>*</sub>.
          Quantitative finite-grid transfer is available only toward one
          fixed L<sup>1</sup>-density target. If d<sub>N</sub> is the
          logarithmic W<sub>1</sub> distance, a growing height must
          satisfy T<sub>N</sub>d<sub>N</sub>→0; cumulative rounding on
          prefix grids makes
          T<sub>N</sub>=o(min{'{'}N,M<sub>N</sub>{'}'}) sufficient.
          Endpoint atoms show why strict interior support is essential,
          while scale-adaptive measures remain outside. The verifier
          checks the δ<sub>√a</sub> factorization only as a normalization
          fixture; the general result is analytic. None of this supplies
          the missing weighted Mellin estimate or identifies a zeta zero.
          T127 makes the rowwise zero-existence statement uniform over
          bounded moving families. Fix K⊂⊂(1,a), a total-variation
          bound M, and c&lt;σ<sub>*</sub>. Weak-* compactness of the
          supported measure ball, compact-open continuity of
          ν↦ℬ<sub>ν</sub>, and Rouché’s theorem on a finite subcover
          give finitely many disks—and therefore one common bounded
          rectangle c&lt;Re z&lt;R, |Im z|&lt;T—meeting every
          symbol zero set. Arbitrary normalized row-dependent positive
          exact weights on K are included, with no convergence or
          regularity in the row.
          The zero can move from row to row, so this supplies no common
          zero and no fixed Mellin factor. The rectangle also need not
          meet 3/2&lt;Re z&lt;2: for δ<sub>√a</sub>, the nonzero
          right-half family lies on Re z=2σ<sub>*</sub>&gt;2 when
          a=32/21. T127 is analytic and gives neither the weighted
          O(N<sup>2</sup>) error, an arithmetic sign, nor a zeta zero.
          T128 then identifies one tuned moving endpoint that does retain
          a fixed comparator modulo O(N). Set
          μ<sub>0</sub>=(32/21)<sup>2/3</sup> and
          u<sub>N</sub>=⌊105μ<sub>0</sub>N+1/2⌋. The exact
          strict-interior prefix Λ<sub>32,21</sub>(105N,u<sub>N</sub>)
          is RH-equivalent under eventual positivity or nonnegativity.
          Its fixed comparator has multiplier
          (a<sup>z</sup>−a)(a<sup>z</sup>+
          a<sup>2z/3</sup>−2); writing y=a<sup>z/3</sup> factors
          the second bracket as (y−1)(y<sup>2</sup>+2y+2).
          The resulting zero lines are Re z=0, 1, and
          2.4683939547…&gt;2, so none meets 3/2&lt;Re z&lt;2.
          A direct algebraic 256-bit Arb/Turing certificate proves the
          normalized RH-side margin exceeds 1/20.
          This does not claim the rounded row symbols are zero-free:
          they may regain dangerous-strip zeros at very large height.
          Landau uses the one fixed comparator and the O(N) endpoint
          transfer. The eventual exact prefix sign is unproved, so RH
          is still unresolved.
          T129 now transfers the unconditional prime-square recurrence
          and the full verified-height moving-heat localization to that
          exact rounded prefix. Its residue is
          B<sub>ad</sub>=(640/3)√5(4√42−21)(64√42−105)
          =727454.763559809…&gt;724000. The O(N) endpoint correction
          has an absolutely holomorphic Dirichlet series for
          Re v&gt;2, while the heat contour stays in Re v&gt;7/3.
          Therefore, for every fixed ε∈(0,B<sub>ad</sub>) and every
          sufficiently large Y, the near-unit power window
          [Y,Y<sup>θ<sub>H</sub></sup>] contains a whole consecutive
          block of ⌊√N·exp(0.8√log N)⌋+1 exact prefixes satisfying
          Λ<sub>n</sub>&gt;(B<sub>ad</sub>−ε)n<sup>3/2</sup>, where
          θ<sub>H</sub>=6000350665601/6000350665597
          =1.0000000000006666277…. The logarithmic counting exponent
          is at least 0.4999999999996666861….
          The endpoint arithmetic is also explicit:
          105μ<sub>0</sub>=∛2688000=139+β with
          1/25&lt;β&lt;1/24, so successive u<sub>N</sub> differ by
          139 or 140 according to an aperiodic mechanical word. A
          finite exact q/K-product recurrence updates Λ from one row
          to the next. Rigorous rational-log fixtures produce positive
          and negative updates for both step letters, while exact
          prime valuations have both signs. Thus ordinary monotonicity,
          a sign attached to the 139/140 symbol, and componentwise
          divisibility cannot close the criterion.
          The remaining target has a clean positive-kernel form.
          A compact nonnegative asymmetric tent h gives
          −D̄(x)=x{'{'}x∫h(r)dr−Σ<sub>p</sub>h(p/x)log p{'}'}.
          Prime powers have the favorable sign and squares supply
          B<sub>ad</sub>x<sup>3/2</sup>; the unresolved term is the
          weighted ψ−x discrepancy. Current unconditional
          zero-free-region estimates are larger than that square
          margin. The moving heat avoids this obstruction only by
          suppressing hypothetical off-line modes too, so it cannot
          imply eventual positivity. Its threshold is ineffective and
          fixed-H; there is no additive o(N) gap, positive-density, or
          RH conclusion.
          T130 identifies the exact scale of the missing bridge. Either
          one-sided tail estimate
          Λ<sub>N</sub>≥−CN<sup>3/2</sup> or
          Λ<sub>N</sub>≤CN<sup>3/2</sup> is individually equivalent
          to RH. Likewise, either local inequality
          Λ<sub>N+1</sub>−Λ<sub>N</sub>≥−C√N log²(2N) or
          Λ<sub>N+1</sub>−Λ<sub>N</sub>≤C√N log²(2N)
          is separately complete. False RH would force
          Λ<sub>N</sub>/N<sup>3/2</sup> to be unbounded in both
          directions. The moving heat cannot supply this raw floor:
          a hypothetical sufficiently high off-line mode is damped by
          the heat while retaining unbounded negative troughs before
          smoothing.
          The algebraic endpoint still gives exact arithmetic
          structure. With ξ=(32/21)<sup>1/3</sup>, Λ splits into
          three nonnegative prime-jump trapezoids with weights 2,2,1,
          but the shortest root buffer already has rigorously opposite
          signs S(4)&gt;2504 and S(84)&lt;−5991 and mixed prime
          valuations. One exact nonnegative five-knot integer tent
          also packages the rounded row, making RH equivalent to an
          eventual square-completed finite Pascal/lcm comparison.
          This does not create a monotone transport: at N=3 the exact
          2<sup>93</sup> threshold count has 179382 eligible upper
          K-factors versus 179424 lower factors. The Hall deficit
          rules out equal-or-larger matching only, not every global
          cross-prime argument. No local drift floor or comparison
          sign has been proved, so RH remains unresolved.
          T131 removes the prime-power buffer from that local target.
          Set 𝒵<sub>N</sub>=log(𝒮<sub>N</sub>/𝒜<sub>N</sub>).
          It has the same exact 139/140 recurrence after replacing
          K<sub>m</sub> by the lcm-completed factor
          K̃<sub>m</sub>=(m+1)<sup>m</sup>/
          [m! lcm(1,…,m)]. The adjacent K̃ jump is exactly
          m log(1+1/m)−Λ<sub>vM</sub>(m), so this is the
          all-prime-power zero channel rather than another smoothing.
          Either one-sided O(√N log²(2N)) bound for
          Δ𝒵<sub>N</sub> is individually RH-equivalent.
          The translated tent kernel
          g<sub>N</sub>=h<sub>N+1</sub>−h<sub>N</sub> satisfies
          |g<sub>N</sub>|≤685440 on
          2205N&lt;t&lt;5120(N+1), but it is signed:
          g<sub>N</sub>(2205N+1)=−64 and
          g<sub>N</sub>(5120(N+1)−1)=21. Its cube-and-higher
          update is O(N<sup>1/3</sup>), while the square update is
          uniformly greater than 1084000√N eventually for both
          Beatty letters.
          This makes the stronger floor
          Δ𝒵<sub>N</sub>≥−10<sup>6</sup>√N sufficient for RH;
          equivalently, one explicit
          2<sup>1400000⌈√N⌉</sup> finite product comparison would
          suffice. That stronger statement is not known and is not
          claimed necessary on RH. After a bounded archimedean row
          correction, the exact remaining task is a signed annular
          von-Mangoldt quadrature
          Σ<sub>t</sub>g<sub>N</sub>(t)
          {'{'}Λ<sub>vM</sub>(t)−1{'}'}. No required eventual
          one-sided bound is proved, so RH remains unresolved.
          T132 applies exact finite Abel summation to that last
          quadrature. It becomes five fixed-width bands of
          E<sub>ψ</sub>(r)=ψ(r)−r at the moving endpoints, with
          coefficients 64, −32, −74, 21, and 21. For N≥7 the broad
          translated kernel has four constant plateaus and exactly
          one interior sign crossing, so the apparent long support is
          dual to bounded endpoint data but not to positive data.
          On a pure mode x<sup>ρ</sup>, each letter s∈{'{'}139,140{'}'}
          has the exact leading factor
          (y<sup>3</sup>−1)
          (160y<sup>3</sup>+sy<sup>2</sup>−210), where
          y=(32/21)<sup>ρ/3</sup>. This factor has no zero for
          0&lt;Re ρ≤1. Thus neither letter hides an off-line leading
          mode, but the mixed band signs still give no domination of
          the full explicit formula and no eventual one-sided ballot.
          T133 shows that positive local averaging cannot repair either
          defect. Every finite nonnegative stencil retains a negative
          value at its first active lower edge and a positive value at
          its last active upper edge. A consecutive L-row block
          telescopes to h<sub>N+L</sub>−h<sub>N</sub> and has an
          effective letter σ∈[139,140]. More generally, every
          normalized nonnegative stencil of width H<sub>N</sub>=o(N)
          has the convex leading multiplier M<sub>σ</sub>. An explicit
          root-distance product bounds that multiplier away from zero
          on 1/2≤Re ρ≤1, so each fixed hypothetical off-line mode
          survives at its natural order. The statement is not uniform
          at growing height and does not preclude a favorable
          arithmetic cancellation; it only closes the positive
          sublinear local-filter shortcut.
          T134 then uses a signed second difference precisely where the
          Beatty word changes. The 140-step defects occur every 24 or
          25 rows. At each defect,
          C<sub>N</sub>=𝒬<sub>N</sub><sup>loc</sup>−
          𝒬<sub>N−1</sub><sup>loc</sup> differs by only O(log N)
          from one universal 32/21 micro-cell 𝒥(u<sub>N</sub>+139).
          Consecutive sampled micro-cells are only 3337 or 3476
          integer steps apart, and 𝒥 changes by O(log v) per step.
          Hence either one-sided square-root-log-squared defect bound
          extends to every scale before applying Landau. The
          consecutive primitive has multiplier
          672(32<sup>ρ</sup>−21<sup>ρ</sup>)/(ρ+1), zero-free for
          Re ρ&gt;0, so either defect direction is individually
          RH-equivalent. This isolates a much sparser exact target;
          it does not prove the required defect bound.
          T135 expands that micro-cell exactly:
          𝒥(v)=672[ψ(32v)−ψ(21v)−11v]+R(v), with
          |R(v)|≤17136[1+log(32v+31)]. For v≥2 its coefficients
          form one nonnegative trapezoid on
          Λ<sub>vM</sub>(n)−1, but that arithmetic input has both
          signs. Let L<sub>m</sub>=lcm(1,…,m),
          X<sub>v</sub>=L<sub>32v</sub>(21v)<sup>21v</sup>(32v−1)!
          and
          Y<sub>v</sub>=L<sub>21v</sub>(32v)<sup>32v−1</sup>(21v)!.
          The exact factorial telescope has only a bounded positive
          deficit, so with
          j<sub>v</sub>=⌈√v log<sup>2</sup>(2v)⌉ either eventual
          orientation
          2<sup>Kj<sub>v</sub></sup>X<sub>v</sub>≥Y<sub>v</sub> or
          2<sup>Kj<sub>v</sub></sup>Y<sub>v</sub>≥X<sub>v</sub>
          is individually RH-equivalent. Opposite 2-adic and
          intermediate-prime valuations rule out divisibility in
          both directions without deciding real order. Neither
          comparison is proved.
          T136 tests the obvious next multiplicative move and closes
          it at every fixed depth. A chain of d adjacent cells cancels
          at every internal 21/32 boundary, leaving exactly one
          [21<sup>d</sup>v,32<sup>d</sup>v] Chebyshev annulus and
          one wider factorial/lcm ratio. Its zero multiplier
          32<sup>dρ</sup>−21<sup>dρ</sup> is still nonzero for
          Re ρ&gt;0, so either buffered real-order direction remains
          RH-equivalent. The negative 2-adic and positive
          interval-prime valuations persist as well. Thus finite
          ladder iteration does not weaken the missing estimate;
          only a scale-uniform growing-depth construction remains
          outside this no-gain theorem.
          T137 then audits that loophole. Subtracting adjacent depths
          returns exactly one T135 cell at a boundary scale, and the
          factorial/lcm cross-ratio returns exactly its integer
          comparator. Exact prime-log enclosures realize all eight
          sign triples across depths one through three, so no
          universal finite-depth sign bootstrap exists. A monotone
          unbounded depth schedule also jumps by a factor greater
          than 32 infinitely often, putting ordinary interpolation
          far above the RH scale. What remains is narrower: a new
          nonlocal coupling among overlapping annuli, not products,
          adjacent quotients, or sampled sign persistence.
          T138 closes the fixed finite version of that coupling.
          After one exact primitive, every nonzero fixed depth
          combination retains infinitely many critical-zero
          frequencies and becomes a nonzero mean-zero
          almost-periodic wave on RH. It therefore has positive and
          negative critical-scale excursions, forcing both signs in
          the arithmetic coupling and both real orders in every exact
          finite factorial/lcm product. The surviving overlap route
          must now be scale-adaptive, genuinely infinite-depth,
          two-sided at critical size, or nonlinear and
          nonhomogeneous.
          T139 closes the first genuinely infinite-depth regime as
          well. If the fixed coefficients have finite uniform
          arithmetic cost
          Σ<sub>d</sub>(d+1)32<sup>d</sup>|c<sub>d</sub>|, their
          analytic multiplier has a compact vertical-translate hull
          containing no zero function. Its critical-strip zero count
          is only O(T), so it cannot cancel the T log T critical
          zeros; the RH almost-periodic wave and both integer signs
          survive. The same summability is impossible for an
          infinite integer exponent vector. Thus a remaining
          infinite-depth route must pay growing arithmetic cost or
          change with scale; uniformly summable overlap is no longer
          an escape.
          T140 quantifies that change-with-scale requirement. A
          row-dependent profile whose cumulative weighted motion
          around one fixed nonzero profile is
          o(X<sup>3/2</sup>) changes the T139 cumulative wave by only
          o(X<sup>3/2</sup>) on RH. Both excursions and both row
          signs survive, including for exact products with sparse
          integer profile edits. A viable adaptive construction must
          therefore move at critical cumulative cost relative to
          every fixed profile, retain a non-summable tail, or use
          genuinely nonlinear arithmetic information.
          T141 then solves the linear adaptive optimization problem.
          The normalized annular response is the exact dual norm, so
          the cheapest row correction and its maximizing depth are
          explicit. Any eventual sign must spend positive critical
          response budget along the T139 excursions. The cheapest
          controller is circular, however: it reads the signed
          Chebyshev annulus and cancels it. What remains is not an
          optimization problem but an independent arithmetic source
          of correctly directed critical budget.
          T142 rules out fixed periodic arithmetic state as that
          source. Every active residue class is a bounded-gap
          sampling of its own fixed-profile T139 primitive, so both
          critical excursions and both row signs survive there.
          Zero-mean and alternating state profiles do not help. The
          next independent controller must have genuinely aperiodic
          or growing state, increasing period, a non-summable tail,
          or nonlinear arithmetic input.
          T143 closes the balanced aperiodic case too. Exact Abel
          summation shows that any positive-density state with
          discrepancy o(√X/log X) retains its density-scaled T139
          wave up to o(X<sup>3/2</sup>). Mechanical and Sturmian
          selectors therefore keep both signs. Remaining state must
          have critical discrepancy, zero density, unboundedly many
          states, changing profiles, or nonlinear arithmetic input.
          T144 closes input-independent random scheduling beyond that
          discrepancy range. The centered selector error is a
          martingale with RH variance O(X<sup>2</sup>log<sup>4</sup>X);
          Kolmogorov maximal inequality and Borel–Cantelli make it
          o(X<sup>3/2</sup>) almost surely. This works simultaneously
          for finitely or countably many fixed-profile states. Any
          surviving randomness must be dependent or nonstationary,
          zero-density, profile-changing, or correlated with the
          arithmetic signal—the last option being T141 feedback.
          T145 also closes ordinary finite-state dependence. For an
          aperiodic Markov class, exponential covariance decay and a
          dyadic maximal inequality make the centered state sum
          o(X<sup>3/2</sup>) almost surely. A periodic class reduces
          through its skeleton to the T142 residue wave. Thus every
          reached recurrent state with a fixed nonzero profile keeps
          both signs. Surviving control must be time-inhomogeneous or
          arithmetic-dependent, zero-density or infinite-state,
          profile-changing, non-summable, or nonlinear.
          T146 closes uniformly mixing time-inhomogeneous control too.
          If all transition kernels preserve one positive law and
          their products contract mean-zero states uniformly, the same
          covariance/maximal proof keeps the centered error
          o(X<sup>3/2</sup>). Even deterministic arithmetic selection
          among such kernels fails. A stochastic escape must move the
          marginal law at critical scale or destroy uniform mixing.
          T147 removes the remaining architectural ambiguity. For any
          history-dependent selector, conditioning on the past splits
          it into a predictable marginal and an o(X<sup>3/2</sup>)
          martingale innovation. Eventual sign therefore requires
          positive critical predictable response budget. The cheapest
          example reads the annular sign itself and is circular; the
          live task is independent arithmetic production of that
          critical correlation.
          T148 tests squarefreeness, a genuinely multiplicative
          independent state whose raw discrepancy is too large for
          T143. Möbius square-divisor expansion and uniform dilation
          quadrature show that squarefree rows retain 1/ζ(2) of the
          critical wave and nonsquarefree rows the complement. Both
          signs survive. Index factorization alone therefore does not
          supply the T147 correlation.
          T149 generalizes this transfer to every positive-density
          divisor-convolution indicator with a positive power margin
          beyond harmonic summability. A power-scale truncation leaves
          the density times the critical wave, so the selected state
          and its complement both retain both signs. The harmonic
          boundary, zero-density states, and direct prime correlation
          remain open.
          T150 crosses that positive-power boundary. A log-squared
          harmonic coefficient moment still makes a balanced
          square-root truncation subcritical. An explicit infinite
          sparse-prime sieve satisfies this condition while failing
          every T149 power moment, yet it too retains both critical
          signs. Only the balanced log-tail threshold, zero density,
          or direct prime-annulus correlation remains in this divisor
          route.
          T151 makes that threshold explicit. Sparse forbidden primes
          with r_k≈klog³k have a full Euler tail of exact order
          log<sup>−2</sup>Q. Their selected-minus-density response is
          one bounded X<sup>3/2</sup>-scale signed dilation
          correlation. If it is subcritical, both signs survive; any
          eventual sign requires phase alignment with the T139 wave.
          Proving or excluding that independent arithmetic alignment
          is now the first critical divisor task.
          T152 eliminates every bounded-height source of that
          alignment. The critical sieve has natural density, its
          centered Dirichlet series cancels the pole at one, and every
          fixed finite zero packet decorrelates at X<sup>3/2</sup>
          scale. Any surviving response must escape to unbounded zero
          height through a nonuniform high-zero/sieve-boundary
          resonance.
          T153 closes that high-zero gap for every fixed finite
          profile. A multiplicative large-sieve bound makes each
          dyadic zero packet O(log T/√T) after normalization, while
          natural density handles the fixed low zeros. Consequently
          every natural-density selector retains the density-scaled
          wave, and the β=3 critical sieve has 𝔎<sub>c</sub>→0.
          T154 extends that closure from fixed finite depth to every
          uniformly summable T139 profile. A depth-dependent
          explicit-formula cutoff gives a summable
          32<sup>d/2</sup>(d+1)<sup>2</sup> majorant, so dominated
          convergence preserves the density-scaled wave through
          infinite ladder depth.
          T155 then allows the profile itself to vary by row. Under a
          coordinatewise summable envelope and a stable Cesàro mean,
          depthwise centering leaves exactly the fixed mean-profile
          wave. Statewise application also rules out every
          deterministic finite-state controller whose natural state
          densities exist, even if its mean profile cancels.
          T156 classifies what remains when those densities fail.
          Every subsequential critical response is an explicit
          functional of a macroscopic dilation-density profile and a
          simultaneous zeta phase; the high-zero tail vanishes
          uniformly. A surviving nondensity controller must therefore
          phase-lock its logarithmic-scale shape to the zeta wave.
          T157 solves smooth fixed-period modulation outside a
          countable exceptional set. Its shifted frequencies are
          γ+2πk/L, so only exact zeta resonance can create a constant
          bias; every generic period retains a nonzero mean-zero wave.
          T158 removes the smoothness loophole: an exponential
          resolvent extends the same theorem to exact binary
          logarithmic blocks and their complements. Only exceptional
          resonant periods remain in the fixed-period block route.
          T159 tests that exceptional route directly. The sharp
          resonant bias is explicit, but a five-depth first-zero
          design that survived 100 and 300 zero packets develops a
          negative sample at 1,000 zeros. The co-design and rigorous
          tail problem remain open.
          T160 then separates the useful resonance from the damaging
          spectrum. The exact half-block resolvent proves that the full
          resonant conjugate pair is pointwise positive, with a
          certified first-zero lower margin; only the other zeros need
          suppression. Their finite-depth Bohr energy is a generalized
          Rayleigh problem. Its first depth-nine profile survives the
          current 100-, 300-, and 1,000-zero finite scans with positive
          sampled margins, unlike T159. This is a stronger design lead,
          not a certificate: interval inputs, uniform phase control,
          Fourier and infinite-zero tails, growing-packet stability,
          and cumulative-to-row transfer remain open.
          T161 closes those analytic finite-sampling and tail
          qualifications for one exact profile, conditional on RH.
          A worst-phase envelope, cyclic Lipschitz mesh, 10,000-zero
          Arb/Turing prefix, and complete residual Hadamard budget
          prove the full limiting response uniformly positive. Hence
          RH implies an eventual strict cumulative product order on
          the resonant log-block rows. The remaining gap has moved:
          prove that aggregate order directly from the arithmetic or
          prove a zero-detecting converse. Neither is known, and
          individual row signs remain uncontrolled.
          T162 repairs the first concrete converse defect. A rigorous
          Rouché disk proves that the original depth-nine multiplier
          itself has an off-line zero above the T161 verified height,
          so one aggregate observable can miss a hypothetical zeta
          zero. Two exact depth-one perturbations retain complete
          RH-conditional positive margins above 0.0007108525, and their
          multipliers have no common zero in the open critical strip.
          The pair is therefore jointly detecting at the multiplier
          level. The remaining obstruction is now frequency-side:
          exceptional resonance, shifted collisions, and the global
          right edge must be controlled after both arithmetic product
          inequalities are proved. None of those steps is yet known.
          T163 derives the required aggregate expansion without RH,
          with an absolutely convergent all-zero response and only an
          O(X log X) integer-transfer error. The half-duty controller
          has precisely the mean and odd harmonics. Pringsheim–Landau
          then excludes every isolated finite false-RH right edge
          unless a zero ordinate is an odd multiple of γ₁ or two
          right-edge ordinates collide modulo γ₁. This is a strict
          frequency-side reduction, not a proof: the product orders
          are still unproved, collision residues may cancel, and an
          infinite or nonattained right edge remains possible.
          T164 classifies that last generic edge escape. Grouping
          shifted collisions by their two-profile residue vector gives
          an exhaustive conditional dichotomy: either every class in a
          full strip below the supremal zero line cancels
          simultaneously for both profiles, or zeros approaching that
          line have ordinates approaching the odd harmonic lattice
          (2ℤ+1)γ₁. Normal convergence away from the uncanceled divisor
          turns Landau&apos;s required real boundary singularity into
          this asymptotic resonance. The two product orders, the joint
          collision shield, and the Diophantine resonance exclusion are
          all still open, so RH is not proved.
          T165 rules out the naive response of adding one
          incommensurate fixed period. Odd harmonic lattices at an
          irrational frequency ratio approach one another arbitrarily
          closely; a positive gap occurs only at a reduced rational
          ratio of opposite parity. Even that exceptional gap does not
          close the argument because separate nonnegative aggregates
          may acquire their Landau boundary witnesses from different
          zero subsequences. A real advance must couple the same zeros,
          prove a quantitative resonance-rate obstruction, use a
          scale-varying frequency, or eliminate the collision shield.
          T166 approaches that shield by ladder depth instead of period.
          The certified base plus one tiny exact coordinate perturbation
          per depth keeps a uniform RH-positive margin. Their moment
          differences detect every fixed collision class: an m-term
          class is visible by depth 2m−1, and one-sided Fourier
          uniqueness handles an infinite absolutely summable class.
          The only collision escape left is diagonal—classes of
          unbounded exact multiplicity approaching a nonattained edge
          while canceling progressively more depths. The associated
          arithmetic orders and exclusion of that configuration remain
          open.
          T167 compresses those depth probes into one geometric
          infinite profile. Its entire parameter path remains
          uniformly RH-positive, and the residue of every fixed
          collision class is a nonzero analytic function of the
          parameter. Outside a countable exceptional set, one profile
          therefore pairs with the T161 base to detect every fixed
          class simultaneously. The parameter is nonconstructive, the
          profile is not a finite exact product, and the half-duty
          controller still permits asymptotic odd resonance.
          T168 makes both mechanisms finite. The nonnegative cosine
          controller has only three Fourier modes, while the base and
          five exact rational depth probes detect every resulting
          collision class. A complete 10,000-zero Arb/Turing and
          Hadamard-tail certificate leaves an RH-conditional margin
          above 0.000375496 for all six profiles. Finite spectral
          support also turns any Landau resonance escape into a bounded
          exact resonance, excluded by the same Turing count. This
          proves that RH is equivalent to six eventual weighted
          aggregate inequalities. It does not prove those inequalities,
          and the controller is tuned to the certified first zeta zero
          rather than built independently from prime data.
          T169 removes two redundant probes from that criterion. The
          exact three-shift determinant for depths one through three
          factors into unit-circle linear roots and a cubic whose roots
          are all certified inside the unit disk by Schur–Cohn margins.
          Because the critical-strip radial parameter has modulus
          greater than one, those three depths detect every collision.
          The resulting criterion needs four eventual orders—the base
          plus depths one, two, and three—not six. Those four orders
          remain RH-equivalent and unproved.
          T170 mixes those three separating directions into one finite
          profile cube. The complete cube retains an RH-conditional
          margin above 0.0003754949. For each shifted collision class,
          cancellation cuts out only a proper affine null slice because
          its three depth residues cannot all vanish. Countably many
          classes still remove only a null set, so almost every single
          cube parameter sees every class at once. Together with the
          finite-spectrum resonance exclusion, this gives a single
          eventual-inequality RH criterion for almost every parameter. It does
          not exhibit an explicit good parameter, prove that arithmetic
          inequality, or remove the controller’s first-zero input.
          T171 shows the three-dimensional genericity is unnecessary:
          restrict the cube to u=(t,t²,t³). Each collision residue is
          then a nonconstant cubic and excludes at most three values of
          t. The total exceptional set is countable, so every parameter
          outside it gives the same one-profile criterion. The gain is
          a sharp scalar derandomization target, not a completed
          derandomization: the exceptional set could still contain all
          rational or algebraic parameters.
          T172 rules out one attractive shortcut to selecting that
          parameter. A uniform Rouché disk proves every multiplier in
          the entire RH-positive cube retains one off-line blind
          location near 0.562266+9924.926872i. These are multiplier
          zeros, not zeta zeros, so the generic equivalence is intact.
          But no point on the cubic path can be chosen by proving its
          multiplier globally zero-free; explicit selection must use
          actual zeta noncoincidence or a different positive component.
          T173 finds that different component constructively. At the
          exact depth-12 path value α=41/200, a complete 10,000-zero
          and Hadamard-tail certificate retains an RH-positive margin
          above 0.0003 after exact scaling, while a separate Rouché
          disk places the tracked blind branch strictly left of the
          critical line. This removes the one known blind branch
          without sacrificing the target response. T174 performs the
          global-zero-free stress and rigorously finds another
          multiplier zero near 0.560850+1.245234i, wholly inside the
          critical strip and below height 14. The completed first-zero
          ledger shows it is not a zeta zero. Thus global multiplier
          zero-freeness is closed for this profile, while actual
          zeta-divisor noncoincidence, paired separation, and the
          arithmetic order remain necessary for a converse.
          T175 then tests the natural prime-side telescoping idea:
          choose period log(32/21), so the controller repeats exactly
          at every paired ladder endpoint. Its frequency 14.916867…
          lies in the certified gap between the first two zeta
          ordinates. A Turing-certified singleton shifted mode makes
          the RH response nonzero with mean zero and therefore Ω±.
          Exact endpoint alignment cannot supply the one-sided bias;
          any surviving arithmetic proof must use a genuinely
          nonlocal prime correlation.
          Separately, for the T93/T96 annular deficit, if RH is false
          both strict signs recur infinitely often; if RH is true the
          certified annular deficit is eventually negative. This is
          genuine subsidiary progress, not QED.
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

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid var(--status-candidate)' }}>
        <strong style={{ color: 'var(--status-candidate)', fontSize: 13 }}>Route M (Nyman-Beurling Burnol/Vasyunin) numerical residuals</strong>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '8px 0 0', lineHeight: 1.65 }}>
          The four records below are honest-status sub-gaps from the Route M finite-N
          numerical program (Burnol-normalized ratio ladder and Vasyunin Gram
          conditioning). Each already carries its own reproducible measurement and
          honest-status banner in src/data/ but was previously referenced only in the
          improvement log, not rendered on any page. None of them establish RH, change
          the PT-Lambda &lt;= 0.2 bound, or claim operator positivity.
        </p>
      </div>

      {ROUTE_M_RESIDUALS.map((r) => (
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
                color: 'var(--brass)',
                border: '1px solid var(--brass-deco)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {r.status}
            </span>
            <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r.tag}</code>
          </div>
          <strong style={{ color: 'var(--ink)', fontSize: 14, display: 'block', marginBottom: 10 }}>
            {r.title}
          </strong>
          {r.body.map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--ink-faint)', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
              {para}
            </p>
          ))}
        </div>
      ))}

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid var(--series-1)' }}>
        <strong style={{ color: 'var(--series-1)', fontSize: 13 }}>Separate Dyson / collision-flow lane</strong>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '8px 0 0', lineHeight: 1.65 }}>
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
                color: r.status === 'OPEN' ? 'var(--accent)' : 'var(--brass)',
                border: "1px solid " + (r.status === 'OPEN' ? ED.accent : ED.brassDeco),
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {r.status}
            </span>
            <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r.tag}</code>
          </div>
          <strong style={{ color: 'var(--ink)', fontSize: 14, display: 'block', marginBottom: 10 }}>
            {r.title}
          </strong>
          {r.body.map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--ink-faint)', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
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

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid var(--status-candidate)' }}>
        <strong style={{ color: 'var(--status-candidate)', fontSize: 13 }}>Odlyzko interior-dip depth-scaling sub-gap</strong>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '8px 0 0', lineHeight: 1.65 }}>
          The record below is a honest-status sub-gap from the Odlyzko number-variance excursion
          program (imp-96452/imp-96493/imp-96510). It already carries its own reproducible
          measurement and honest-status banner in src/data/ but was previously referenced only in
          the improvement log, not rendered on any page. It does not establish RH, change the
          PT-Lambda &lt;= 0.2 bound, or claim operator positivity.
        </p>
      </div>

      {DIP_DEPTH_RESIDUALS.map((r) => (
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
                color: 'var(--brass)',
                border: '1px solid var(--brass-deco)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {r.status}
            </span>
            <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r.tag}</code>
          </div>
          <strong style={{ color: 'var(--ink)', fontSize: 14, display: 'block', marginBottom: 10 }}>
            {r.title}
          </strong>
          {r.body.map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--ink-faint)', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
              {para}
            </p>
          ))}
        </div>
      ))}

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid var(--series-5)' }}>
        <strong style={{ color: 'var(--series-5)', fontSize: 13 }}>Route I (Toeplitz/Krein certificate) uniform-N gap</strong>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '8px 0 0', lineHeight: 1.65 }}>
          The record below consolidates three honest-status sub-gaps from the Route I Krein-floor
          program (imp-96846 route assessment, imp-96848 partial tail-trace closure, imp-96835
          2a-monotonicity cross-check). Each already carries its own reproducible measurement or
          derivation in src/data/ but was previously referenced only in the improvement log. None of
          them establish operator positivity, change the interval-rigorous certified reach (2a &le; 0.96),
          or claim RH.
        </p>
      </div>

      {ROUTE_I_VERDICT.map((r) => (
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
                color: 'var(--brass)',
                border: '1px solid var(--brass-deco)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {r.status}
            </span>
            <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r.tag}</code>
          </div>
          <strong style={{ color: 'var(--ink)', fontSize: 14, display: 'block', marginBottom: 10 }}>
            {r.title}
          </strong>
          {r.body.map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--ink-faint)', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
              {para}
            </p>
          ))}
        </div>
      ))}

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid var(--series-2)' }}>
        <strong style={{ color: 'var(--series-2)', fontSize: 13 }}>Honest status: Krein uniform-N cohort (imp-97154)</strong>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '8px 0 0', lineHeight: 1.65 }}>
          imp-97154 groups four uniform-N Krein-floor tickets (imp-96749, imp-97100, imp-97120,
          imp-97121) as a single RITZ-UPPER-BOUNDS-INSUFFICIENT family. Every quantity measured
          across this cohort &mdash; the Rayleigh-tail quadrature estimate (imp-97100) and the Ritz
          eigenvalue estimate (imp-97120) &mdash; is an <strong>UPPER bound</strong> on the true
          lambda_min(T_a[sigma_2]) (Rayleigh-Ritz variational principle), <strong>never a certified
          lower bound</strong>. The uniform-in-N positivity question (IMP96749_UNIFORM_N_GAP_UNSETTLED)
          stays open; the interval-rigorous certified reach remains exactly 2a &le; 0.96. No Ritz or
          Rayleigh value from this cohort should be re-cited as a certified floor. RH open;
          no refereed bound is changed; NO QED.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid var(--status-nogo)' }}>
        <strong style={{ color: 'var(--status-nogo)', fontSize: 13 }}>kmax=5 Krein cutting-plane frontier: near-feasible vs. certified</strong>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '8px 0 0', lineHeight: 1.65 }}>
          The record below consolidates the kmax=5 degree-frontier cohort (imp-96845, imp-96868,
          imp-96881 double-precision measurements; imp-96956 interval-verification attempt). The
          double-precision LP is solvable well past 2a=0.96, but that near-feasibility does not survive
          interval-rigorous verification: the certified reach stays exactly 2a &le; 0.96.
        </p>
      </div>

      {KMAX5_FRONTIER_VERDICT.map((r) => (
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
                color: 'var(--brass)',
                border: '1px solid var(--brass-deco)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {r.status}
            </span>
            <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r.tag}</code>
          </div>
          <strong style={{ color: 'var(--ink)', fontSize: 14, display: 'block', marginBottom: 10 }}>
            {r.title}
          </strong>
          {r.body.map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--ink-faint)', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
              {para}
            </p>
          ))}
        </div>
      ))}

      <div className="card" style={{ marginBottom: 18, borderLeft: '3px solid var(--series-1)' }}>
        <strong style={{ color: 'var(--series-1)', fontSize: 13 }}>Route C-direct (Kato-Temple / Lehmann-Goerisch): doubly blocked</strong>
        <p style={{ fontSize: 13, color: 'var(--ink-faint)', margin: '8px 0 0', lineHeight: 1.65 }}>
          The record below consolidates imp-96865 (certified exogenous seed forced negative) and imp-96875
          (direct residual diverges even with a granted positive seed), showing Route C-direct cannot deliver
          a positive floor and the only remaining path reduces to the open Route B (N,T) resolvent-truncation
          rate.
        </p>
      </div>

      {ROUTE_C_DOUBLE_BLOCK_VERDICT.map((r) => (
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
                color: 'var(--brass)',
                border: '1px solid var(--brass-deco)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {r.status}
            </span>
            <code style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{r.tag}</code>
          </div>
          <strong style={{ color: 'var(--ink)', fontSize: 14, display: 'block', marginBottom: 10 }}>
            {r.title}
          </strong>
          {r.body.map((para, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--ink-faint)', lineHeight: 1.65, marginTop: i === 0 ? 0 : 10, marginBottom: 0 }}>
              {para}
            </p>
          ))}
        </div>
      ))}

      <div className="card" style={{ marginTop: 8, borderLeft: '3px solid var(--rule)' }}>
        <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--ink-soft)' }}>Scope separation:</strong>{' '}
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
          <Link to="/state-of-program" style={{ color: 'var(--ink-faint)' }}>State of the Program</Link>
          <Link to="/route-map" style={{ color: 'var(--ink-faint)' }}>Route Map</Link>
          <Link to="/rh-dag" style={{ color: 'var(--ink-faint)' }}>Proof DAG</Link>
          <Link to="/spectral-attack" style={{ color: 'var(--ink-faint)' }}>Spectral Approach</Link>
        </div>
      </div>
    </div>
  );
}
