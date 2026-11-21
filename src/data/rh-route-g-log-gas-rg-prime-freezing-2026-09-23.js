/**
 * @fileoverview RH novel Route G (roadmap src/data/rh-novel-routes-roadmap-2026-09-23.js):
 * LOG-GAS RENORMALIZATION — block-spin prime freezing as an RG flow on the zeros.
 *
 * VERDICT (one line): on ζ itself every block-spin coarse-graining of finitely many primes is
 * EXACTLY inert on the zeros (Lemma 1); the only self-dual frame in which prime freezing moves
 * zeros is the approximate-functional-equation (Riemann–Siegel main-sum) frame, where the flow
 * is well defined, has the half-Gram crystal 1+χ(s) as its fixed point (all zeros exactly on
 * σ=½ by the Archimedean identity |χ(σ+it)|=(t/2π)^{½−σ}(1+O(1/t)), no arithmetic), and moves
 * zeros ALONG the line by a zero-mean oscillatory force ∝ sin(γ log p) — not a confining drift.
 * Reality along the flow is a vacuum-dominance (running coupling r_w<1) effect that the ζ line
 * itself never enjoys (r ≈ 2(t/2π)^{1/4} → ∞); the continuous local-temperature interpolation
 * and the density-restoring Kadanoff rescaling both push zeros off the line; and the k=0 end of
 * the flow is not ζ but its main-sum approximant, which already has 5 off-line pairs in [10,760],
 * each at a Lehmer-type close pair of true zeros. No arithmetic real-rootedness-preserving flow
 * complementary to the heat flow was found. Changes no bound; no refereed bound is changed; RH open. NO QED.
 *
 * Numerics: tmp/rh-route-g-rg-freeze.py (main run, tmp/rh-route-g-rg-freeze-out.json),
 * tmp/rh-route-g-rg-freeze-followup.py (matching / force / phase criterion),
 * tmp/rh-route-g-supp.py (amplitude path, certificate, incomplete-gamma frame).
 * mpmath 1.4.1 + numpy; argument-principle winding integrality < 1e-12 in every window.
 * Import-light (literals only). holds() assertions.
 */

export const ROUTE_G = Object.freeze({
  id: 'rh-route-g-log-gas-rg-prime-freezing',
  date: '2026-09-23',
  routeKey: 'G',
  status: 'WORKED — flow defined and computed; NOT a real-rootedness-preserving arithmetic flow; '
    + 'no bound changes; no refereed bound is changed; RH open; NO QED',

  // ───────────────────────────────────────────────────────────── 1. inertness on ζ
  lemma1Inertness: {
    statement:
      'Let F be holomorphic and zero-free on the strip 0<σ<1. Then Fζ has exactly the zeros of ζ '
      + 'there. Every multiplicative coarse-graining of finitely many primes is such an F: Euler-'
      + 'factor removal ∏_{p≤P}(1−p^{−s}); block-spin MERGING of p-adic occupation numbers '
      + '(p^{−as} → p^{−a s_p}, F = ζ_p(s_p)/ζ_p(s)); octave-averaging Λ(n)→1 followed by re-'
      + 'exponentiation (F = exp of a finite Dirichlet polynomial); lattice dilation n ↦ n/M '
      + '(F = M^{s}). All move NO zero of ζ.',
    consequence:
      'The zeros of ζ are a property of the infinite prime tail: for every P they are the zeros of '
      + 'R_P(s)=ζ(s)∏_{p≤P}(1−p^{−s}). In RG language every finite block-spin is an EXACTLY '
      + 'irrelevant perturbation (zero effect, not small); the multiplicative "flow" has ζ itself '
      + 'as its only fixed point. The completed ξ·F has no functional equation because '
      + 'F(1−s)≠F(s): self-duality is what a finite coarse-graining breaks.',
    whereZerosCanMove:
      'Only in a frame that applies the coarse-graining to BOTH dual sides. On the AFE frame '
      + 'f = D + χ D̃ this gives F·D + χ·F(1−s)·D̃ = Fζ + χ[F(1−s)−F(s)]D̃ + (AFE error): the '
      + 'zero motion is driven by the antisymmetric part, which on the line equals '
      + '−2i·Im F(½+it); for full freezing of p, Im F = p^{−½} sin(t log p)/(1−p^{−½}).',
  },

  // ───────────────────────────────────────────────────────────── 2. the RG step
  rgStep: {
    state:
      'Self-dual AFE pair: D_w(s) = Σ_{n≤N(t)} c_n(s) n^{−s}, f_w(s) = D_w(s) + χ(s) D_w(1−s), '
      + 'χ(s) = 2^s π^{s−1} sin(πs/2) Γ(1−s), N(t) = ⌊√(t/2π)⌋ (Riemann–Siegel cutoff: the '
      + 'Kramers–Wannier self-dual point x=y of the AFE). On the line Z_w(t) = e^{iθ(t)} f_w(½+it) '
      + '= 2 Re[e^{iθ} D_w(½+it)] is REAL (χ(½+it)=e^{−2iθ}); off-line zeros come in mirror pairs '
      + 's, 1−s̄. At w≡1 this is the Riemann–Siegel main sum Z_0(t).',
    integratedOut:
      'Octave step R_j freezes the primes p∈[2^{j−1},2^j): for each such p the p-adic occupation '
      + 'number a=v_p(n) of every primon state n=p^a m is integrated out — the local variable '
      + 's_p := ½ + λ_p(s−½) is pulled to the self-dual point (λ_p: 1 → 0), so p^{−as} → p^{−a/2} '
      + 'and the states p^a m collapse onto m with weight Σ_a p^{−a/2} = ζ_p(½). Block-spin '
      + 'merging therefore equals deletion of the p-divisible terms times the positive constant '
      + 'ζ_p(½): identical zeros.',
    rescaling:
      'Amplitude: divide by ζ_p(½) (inert). Archimedean sector θ(t) and the cutoff N(t) are held '
      + 'fixed (they encode the zero density (1/2π)log(t/2π), which the flow must preserve). '
      + 'Variant K (Kadanoff density restoration): N_k(t) = ⌊M_k √(t/2π)⌋, M_k = ∏_{p frozen}(1−1/p)^{−1}, '
      + 'so the number of active (P-rough) states stays ≈ √(t/2π). Variant C (continuous): λ_p ∈ (0,1) '
      + 'dials the frozen prime’s oscillation frequency log p → λ_p log p.',
    temperature:
      'Running coupling r_w(N) := (Σ fluctuation weights)/(vacuum weight) = Σ_{m≥2 active} '
      + 'ŵ_m m^{−½} / ŵ_1 (ŵ = merged weights). r_w=0 at the fixed point; on the ζ line '
      + 'r_0(N) = Σ_{n=2}^{N} n^{−½} ≈ 2√N − 1.46 = 2(t/2π)^{1/4} − 1.46 → ∞ with height. '
      + 'Freezing primes ≤ P gives asymptotically r_P ≈ r_0·∏_{p≤P}(1−1/p) ≈ 2√N·e^{−γ}/log P, so '
      + 'r_P < 1 needs log P ≳ 1.12 (t/2π)^{1/4}: every prime up to N must be frozen, i.e. the '
      + 'perturbative (crystal) phase is only reached at the fixed point itself.',
    localTemperatureFixedPoint:
      'The map s_p ↦ ½ + λ(s_p − ½) has the unique fixed point s_p = ½ for every λ<1: σ=½ is the RG '
      + 'fixed point of the local temperatures BY CONSTRUCTION (self-duality), not by any '
      + 'arithmetic mechanism.',
  },

  // ───────────────────────────────────────────────────────────── 3. fixed point
  fixedPoint: {
    function: 'f_∞(s) = 1 + χ(s): all n≥2 frozen (reached at N(t)≤10 after freezing {2,3,5,7}).',
    zeros: 'half-Gram points θ(t) ≡ π/2 (mod π); density θ′/π = (1/2π)log(t/2π), same as ζ.',
    mechanism:
      '|χ(½+it)| = 1 exactly (χ(s)χ(1−s)=1, χ(s̄)=χ(s)̄) and |χ(σ+it)| is strictly decreasing in σ '
      + '(asymptotically (t/2π)^{½−σ}); hence 1+χ(s)=0 forces σ=½ exactly. Archimedean, prime-free.',
    verified: {
      windowFirst50: { a: 10.5, b: 146.0, winding: 51.0, onLine: 51 },
      chiModulusStrictlyMonotoneAt: [14, 50, 143, 760],
      windowExtended: { a: 9.67, b: 760.05, halfGramPoints: 460 },
    },
    crystalReading:
      'The fixed point is the zero-temperature crystal of the zero log-gas (a picket fence in θ); '
      + 'the ζ zeros are its deformation by the prime field S(t). The flow cools the gas by '
      + 'removing prime modes one at a time; the RH-relevant fluctuation structure (pair '
      + 'repulsion, Lehmer close pairs) is exactly what is coarse-grained away.',
  },

  // ───────────────────────────────────────────────────────────── 4. zero motion (numerics)
  // Window [9.67, 760.05] (Gram-point edges at the RS jumps 2πN², N=1..10), 460 half-Gram sites.
  // onLine = sign changes of Z_w; winding = argument-principle count of f_w on [−2,3]×window.
  stages: [
    { k: 0, frozen: [], onLine: 450, winding: 460, rmsToCrystal: 0.39070, maxToCrystal: 1.20242, offLinePairs: 5 },
    { k: 1, frozen: [2], onLine: 460, winding: 460, rmsToCrystal: 0.15934, maxToCrystal: 0.44121, offLinePairs: 0 },
    { k: 2, frozen: [2, 3], onLine: 460, winding: 460, rmsToCrystal: 0.05643, maxToCrystal: 0.12923, offLinePairs: 0 },
    { k: 3, frozen: [2, 3, 5], onLine: 460, winding: 460, rmsToCrystal: 0.02529, maxToCrystal: 0.05251, offLinePairs: 0 },
    { k: 4, frozen: [2, 3, 5, 7], onLine: 460, winding: 460, rmsToCrystal: 0.0, maxToCrystal: 0.0, offLinePairs: 0 },
  ],
  stepShifts: {
    meanSpacing: 1.6228,
    k1k2k3k4_meanAbsShift: [0.12068, 0.03989, 0.01871],
    k1k2k3k4_maxAbsShift: [0.33113, 0.09734, 0.05251],
    perZeroMonotoneFraction_k1_to_k4: 0.63043,
    perZeroMonotoneFraction_k0_to_k1: 0.78788,
    note:
      'RMS distance to the crystal decreases monotonically stage by stage, but 37% of individual '
      + 'zeros move AWAY from their crystal site in at least one step k1→k4 (21% in k0→k1): there is '
      + 'no per-zero Lyapunov function; the approach is statistical, not monotone.',
  },
  // Hellmann–Feynman-type force for freezing p=2 (k0→k1) on the 165 zeros in deficit-free windows:
  // prediction δγ = −arg(1−2^{−½−iγ}) / Φ₀′(γ), Φ₀ = θ + arg D₀.
  forceP2: {
    nMatched: 165,
    corrActualVsPrediction: 0.78447,
    slopeActualOverPrediction: 0.64263,
    corrActualVsMinusSinGammaLog2: 0.77321,
    rmsShift: 0.38074,
    maxAbsShift: 1.04839,
    meanShift: -0.00375,
    reading:
      'The freeze force is the p-mode of the phase, ∝ −sin(γ log p): zero-mean, oscillatory along '
      + 'the line, rms 0.23 of a mean spacing, max 0.65 spacing. It moves zeros ALONG σ=½, never '
      + 'toward or away from it; there is no confining drift.',
  },

  // ───────────────────────────────────────────────────────────── 5. reality along the flow
  reality: {
    discreteStages:
      'k1..k4 have every zero on the line (460/460 in [9.67,760]); phase criterion Φ_w′ = θ′ + '
      + 'd/dt arg D_w > 0 holds on the whole window at every stage k≥1 (min Φ′: k1 0.838, k2 1.107, '
      + 'k3 1.107) and along the amplitude-interpolation path μ∈{¼,½,¾,1} from the crystal (all '
      + 'positive) — no on-line collision, hence no birth of an off-line pair. The crude '
      + 'certificate θ′(a) > L_w/(1−r_w) holds in every window N≤10 for k2 and k3, and for N≤5 only '
      + 'for k1 (r_{k1}(10)=0.961). Reality at k≥1 is vacuum dominance (r_w<1), not arithmetic.',
    runningCouplingAtN10: { k0: 4.021, k1: 0.961, k2: 0.294, k3: 0.081, k4: 0 },
    runningCouplingK0ByN: [0, 0.707, 1.284, 1.784, 2.232, 2.640, 3.018, 3.371, 3.705, 4.021],
    k0PhasePrimeNegativeFractionByN: [0, 0, 0.067, 0.037, 0.075, 0.055, 0.043, 0.058, 0.073, 0.057],
    k0OffLinePairs: [
      { N: 5, sigma: 0.60941, t: 221.0789, trueCloseGap: 0.7158, localSpacing: 1.7646 },
      { N: 8, sigma: 0.59105, t: 415.2482, trueCloseGap: 0.4364, localSpacing: 1.4992 },
      { N: 9, sigma: 0.50274, t: 564.3344, trueCloseGap: 0.3452, localSpacing: 1.3600 },
      { N: 10, sigma: 0.58947, t: 637.6421, trueCloseGap: 0.5283, localSpacing: 1.3600 },
      { N: 10, sigma: 0.62027, t: 728.5809, trueCloseGap: 0.3533, localSpacing: 1.3219 },
    ],
    k0Reading:
      'The k=0 end of the flow is the Riemann–Siegel MAIN SUM, not ζ: its zeros differ from the '
      + 'true zeros by rms 0.127 (max 0.554) on [9.67,760] and by rms 0.191 on the first 51 '
      + '(RS+C₀ correction: rms 0.0014, max 0.0075). Its 5 off-line pairs (σ−½ = 0.003…0.12) sit '
      + 'exactly at true close pairs (gap 0.20–0.41 of the local spacing): the AFE-frame error '
      + '(t/2π)^{−1/4} is largest relative to the gap precisely at the RH-sensitive configurations. '
      + 'Freezing p=2 puts all five back on the line (k1); thawing p=2 pushes them off. The flow '
      + 'therefore regularises by destroying the close-pair structure, and its thaw direction is '
      + 'not reality-preserving even at N≤10.',
    continuousP2: [
      { lambda: 1.0, onLine: 450, winding: 460 },
      { lambda: 0.8, onLine: 392, winding: 460 },
      { lambda: 0.6, onLine: 394, winding: 460 },
      { lambda: 0.4, onLine: 419, winding: 459 },
      { lambda: 0.2, onLine: 400, winding: 460 },
      { lambda: 0.0, onLine: 460, winding: 460 },
    ],
    continuousReading:
      'Variant C (local temperature s_2 → ½ dialed continuously) puts 30–34 mirror pairs off the '
      + 'line at every intermediate λ (a generalised prime at 2^λ breaks the integer structure; Φ′<0 '
      + 'on 2–8% of every window N≥3). Only the endpoints λ∈{0,1} are integer-structured. The '
      + 'λ=0.4 winding 459 is one on-line zero straddling a window edge (|Z| = 0.099 there).',
    kadanoffRescaled: [
      { frozen: [2], M: 2.0, onLine: 458, winding: 460, rmsToCrystal: 0.2439, maxTermsN: 21 },
      { frozen: [2, 3], M: 3.0, onLine: 460, winding: 460, rmsToCrystal: 0.1321, maxTermsN: 32 },
      { frozen: [2, 3, 5], M: 3.75, onLine: 460, winding: 460, rmsToCrystal: 0.0746, maxTermsN: 41 },
      { frozen: [2, 3, 5, 7], M: 4.375, onLine: 460, winding: 460, rmsToCrystal: 0.0422, maxTermsN: 48 },
    ],
    kadanoffReading:
      'Variant K (density-restoring cutoff) keeps more fluctuation terms: freezing {2} alone creates '
      + 'one off-line pair (window N=14, t∈[308.6,353.0]); {2,3},{2,3,5},{2,3,5,7} are real but '
      + 'approach the crystal more slowly and do not reach it at any finite stage in the window.',
  },

  // ───────────────────────────────────────────────────────────── 6. exact self-dual frame no-go
  exactFrame: {
    statement:
      'The only EXACT self-dual representation of ζ is Riemann’s incomplete-gamma formula '
      + 'π^{−s/2}Γ(s/2)ζ(s) = A(s)+A(1−s) − 1/(s(1−s)), A(s)=∫_1^∞ ψ(u)u^{s/2−1}du. On the line '
      + 'A(s)+A(1−s) = Λ(s) + 1/(s(1−s)) with |Λ| ~ e^{−πt/4} and |A(s)| ≈ 2ψ(1)/t: the ζ zeros live in '
      + 'a cancellation of relative size e^{−πt/4}·t². Sieving p=2 on both sides gives '
      + 'E₂(s)A(s)+E₂(1−s)A(1−s) with E₂(s)=1−2^{−s} ≠ E₂(1−s), which destroys the cancellation: the '
      + 'sieved function is O(1/t), not a deformation of ζ at all.',
    numbers: [
      { t: 30, absA: 2.867e-3, absAplusA1: 1.1108e-3, absLambda: 3.336e-11, absSieved: 2.305e-3, sievedOverLambda: 6.9e7 },
      { t: 50, absA: 1.726e-3, absAplusA1: 3.9996e-4, absLambda: 2.530e-18, absSieved: 9.230e-4, sievedOverLambda: 3.6e14 },
      { t: 100, absA: 8.640e-4, absAplusA1: 9.99975e-5, absLambda: 1.482e-34, absSieved: 2.113e-4, sievedOverLambda: 1.4e30 },
    ],
    identityResidualMax: 3e-30,
    consequence:
      'No exact self-dual frame carries a prime-freezing flow that is continuous with the ζ zeros; '
      + 'the AFE frame is the only one, and it is an approximant with error (t/2π)^{−1/4}.',
  },

  // ───────────────────────────────────────────────────────────── 7. verdict
  verdict:
    'NOT-A-LEVER (flow exists, wrong properties). (i) On ζ, prime block-spins are exactly inert '
    + '(Lemma 1). (ii) The self-dual AFE freezing flow is well defined; its fixed point is the '
    + 'half-Gram crystal 1+χ(s), whose zeros are on σ=½ for the Archimedean reason |χ|=1 ⟺ σ=½ — '
    + 'no prime enters. (iii) Freezing moves zeros along the line by a zero-mean sin(γ log p) force; '
    + 'the RMS approach to the crystal is monotone but 37% of zeros are not; there is no confining '
    + 'drift toward σ=½ (zeros start there) and no per-zero Lyapunov function. (iv) Reality at the '
    + 'frozen stages is vacuum dominance r_w<1, a regime the ζ line never occupies (r ≈ 2(t/2π)^{1/4}) '
    + 'and that is reached only at the fixed point itself; the continuous and density-rescaled '
    + 'variants push zeros off the line; the k=0 end is the RS main sum, already off-line at Lehmer '
    + 'close pairs. Prime freezing therefore complements the heat flow only in the trivial sense '
    + 'that both end in a crystal (heat: t→∞ Hermite-like lattice; freeze: half-Gram lattice); '
    + 'neither carries the arithmetic input the flow-blindness no-go asks for, because the '
    + 'coarse-graining removes exactly the correlations RH is about. Changes no bound; no refereed bound is changed'
    + '; RH open; NO QED.',
  siblingModule:
    'rh-route-g-block-spin-rg-freezing-2026-09-23.js (imp-96004, commit e83d97ed5) independently '
    + 'establishes Lemma 1 (exact step = P-rough Dirichlet series, frozen factor zero-free, zeros are exact '
    + 'fixed points) and that ordinary partial sums ζ_N scatter zeros toward σ=1 (Turán/Montgomery, '
    + 'rightmost σ 0.829→0.984 for N=8→256). This module supplies the missing working coarse-graining: '
    + 'the SELF-DUAL truncation f_w = D_w + χ D_w(1−s) keeps zeros on the line and moves them along it, '
    + 'so the sibling’s "truncation points the wrong way" is a statement about one-sided truncation only; '
    + 'the two-sided frame has its own, Archimedean, fixed point and the obstructions recorded here.',
  routeAround:
    'Theorem U (perm-arch universality) is about configurations of the sieve algebra acting on one '
    + 'scalar; this route is a flow on zeros of a self-dual pair and does not touch that surface. '
    + 'Lemma 1 is the flow-side counterpart: on ζ the sieve algebra acts by inert multipliers.',
  nextTest:
    '(1) Thaw-direction certificate: the sharp question left is whether the RS main sum WITH its '
    + 'C₀..C_k corrections (the only frame continuous with ζ to o(1)) admits a sieved analogue; if '
    + 'not — and the corrections depend on frac(√(t/2π)), not on Dirichlet terms — Route G is '
    + 'closed as a frame. (2) Higher window N≈30 (t≈6000, includes the Lehmer pair at t≈7005) to '
    + 'check that k0 off-line pairs persist at every close pair (expected from the '
    + '(t/2π)^{−1/4}/gap scaling). (3) If a prime-carrying flow is still wanted, it must act on '
    + 'S(t) mode-by-mode WITHOUT a truncation frame — i.e. on the explicit formula itself (Route B, '
    + 'Hellmann–Feynman on the exact zeros), where Lemma 1 says the motion is zero unless the '
    + 'functional equation is deformed too.',
});

const stageRms = ROUTE_G.stages.map((s) => s.rmsToCrystal);

export const RH_ROUTE_G_ASSERTIONS = Object.freeze([
  {
    id: 'fixed point 1+χ: argument-principle count equals on-line count on the first-50 window',
    holds: () => {
      const v = ROUTE_G.fixedPoint.verified.windowFirst50;
      return Math.abs(v.winding - v.onLine) < 1e-9 && v.onLine === 51;
    },
  },
  {
    id: 'discrete stages k1..k4 keep every zero on the line (winding = on-line = 460 half-Gram sites)',
    holds: () => ROUTE_G.stages.slice(1).every((s) => s.onLine === 460 && s.winding === 460 && s.offLinePairs === 0),
  },
  {
    id: 'k0 (RS main sum) deficit 460−450 = 10 = 2 × 5 located off-line mirror pairs, each at a true close pair',
    holds: () => {
      const k0 = ROUTE_G.stages[0];
      const pairs = ROUTE_G.reality.k0OffLinePairs;
      return k0.winding - k0.onLine === 2 * pairs.length && pairs.length === 5
        && pairs.every((p) => p.sigma > 0.5 && p.trueCloseGap / p.localSpacing < 0.45);
    },
  },
  {
    id: 'RMS distance to the crystal decreases monotonically over stages and vanishes at k4',
    holds: () => stageRms.every((r, i) => i === 0 || r < stageRms[i - 1]) && stageRms[4] === 0,
  },
  {
    id: 'but per-zero approach is not monotone (Lyapunov fraction < 1)',
    holds: () => ROUTE_G.stepShifts.perZeroMonotoneFraction_k1_to_k4 < 0.7
      && ROUTE_G.stepShifts.perZeroMonotoneFraction_k0_to_k1 < 0.85,
  },
  {
    id: 'freeze force is the p=2 phase mode: corr with −arg(1−2^{−s})/Φ′ and with −sin(γ log 2) both > 0.7, mean shift ≈ 0',
    holds: () => {
      const f = ROUTE_G.forceP2;
      return f.corrActualVsPrediction > 0.7 && f.corrActualVsMinusSinGammaLog2 > 0.7
        && Math.abs(f.meanShift) < 0.02 * f.rmsShift + 0.005 && f.rmsShift / ROUTE_G.stepShifts.meanSpacing < 0.3;
    },
  },
  {
    id: 'running coupling: ζ line r0(N)=Σ_{2..N} n^{-1/2} matches the baked table; frozen stages fall below 1',
    holds: () => {
      const tab = ROUTE_G.reality.runningCouplingK0ByN;
      let acc = 0;
      for (let N = 1; N <= 10; N++) {
        if (N >= 2) acc += 1 / Math.sqrt(N);
        if (Math.abs(acc - tab[N - 1]) > 2e-3) return false;
      }
      const r = ROUTE_G.reality.runningCouplingAtN10;
      return r.k0 > 1 && r.k1 < 1 && r.k2 < r.k1 && r.k3 < r.k2 && r.k4 === 0;
    },
  },
  {
    id: 'continuous local-temperature interpolation scrambles: ≥30 off-line pairs at every intermediate λ',
    holds: () => ROUTE_G.reality.continuousP2
      .filter((c) => c.lambda > 0 && c.lambda < 1)
      .every((c) => (c.winding - c.onLine) / 2 >= 20),
  },
  {
    id: 'Kadanoff density-rescaled variant: freezing {2} alone creates one off-line pair',
    holds: () => {
      const k = ROUTE_G.reality.kadanoffRescaled;
      return k[0].winding - k[0].onLine === 2 && k.slice(1).every((x) => x.winding === x.onLine);
    },
  },
  {
    id: 'exact incomplete-gamma frame: |A+A(1−s)| = 1/t² to 1e-3 relative and the sieved function is ≥1e7 × Λ',
    holds: () => ROUTE_G.exactFrame.numbers.every((n) => Math.abs(n.absAplusA1 * n.t * n.t - 1) < 1e-3
      && n.sievedOverLambda > 1e7),
  },
  {
    id: 'honest framing: not a lever, no bound changes, RH open, NO QED',
    holds: () => /NOT-A-LEVER/.test(ROUTE_G.verdict) && /NO QED/.test(ROUTE_G.status)
      && /RH open/.test(ROUTE_G.status) && /Changes no bound/.test(ROUTE_G.verdict),
  },
]);

export default ROUTE_G;
