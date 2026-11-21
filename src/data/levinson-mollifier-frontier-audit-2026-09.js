// @module data/levinson-mollifier-frontier-audit-2026-09
//
// LEVINSON / MOLLIFIER "PROPORTION OF ZEROS ON THE CRITICAL LINE" PROGRAM —
// literature-verified state of the art (2026-09-22), the binding barrier, an
// executed optimisation of the Levinson–Conrey functional over the mollifier
// length θ, and an honest odds assessment.  Import-free; every number below is
// either a literal transcribed from the cited source or recomputed here from
// the Conrey functional by the embedded quadrature.
//
// HEADLINE (verified against the papers, not memory)
// --------------------------------------------------
// 1. The Levinson-lineage record is κ ≥ 0.417293962 (> 5/12) and κ* ≥ 0.407511457
//    (simple zeros on the line): Pratt–Robles–Zaharescu–Zeindler, Res. Math. Sci. 7
//    (2020) art. 2, arXiv:1802.10521 §8 (θ = 4/7 − ε, R = 1.3036, d = 1, K = 3).
// 2. It is NO LONGER the record for κ.  Alpöge–Furman (proof discovered by Claude,
//    Anthropic; arXiv:2608.13637, Aug 2026, Lean 4 formalised) prove unconditionally
//    that ≥ 2/3 of the zeros are SIMPLE AND ON THE LINE, 0.6725 with the
//    Montgomery–Taylor window, and ≥ 5/6 (0.8362) distinct.  Lamzouri
//    (arXiv:2609.02882, Sep 2026) gives an independent, simpler proof via a single
//    Hilbert-space inequality and adds: ≥ 88.76% are simple OR on the line.  The
//    route is Montgomery's 1973 pair-correlation argument with RH removed
//    (unconditional form factor on Fourier support [−1,1]: Aryan 2022; Baluyot–
//    Goldston–Suriajaya–Turnage-Butterbaugh arXiv:2501.14545).  The mollifier does
//    not appear at all.
// 3. Binding barrier of the Levinson method = mollifier length θ.  Executed here:
//    the one-piece Conrey functional at the proven length θ = 4/7 is SHAPE-SATURATED
//    (κ = 0.4089592 with deg P = 5, deg Q = 3; identical to 6e-6 with deg 12/8), and
//    dκ/dθ ≈ 0.57 at θ = 4/7.  The θ step 1/2 → 4/7 (Conrey 1989, Deshouillers–Iwaniec
//    Kloosterman input) gained +0.043; ALL multi-piece mollifier work 1989 → 2020
//    (BCY, Feng, PRZZ) gained +0.0083 in total.
// 4. Even a FULL-LENGTH mollifier θ = 1 (far beyond anything provable; the generic-
//    coefficient limit is 17/33, Bettin–Chandee–Radziwiłł) gives one-piece
//    κ = 0.5884 < 0.6725.  Matching the pair-correlation record by the Levinson
//    route needs θ ≈ 1.339, i.e. a mollifier of length T^{1.34} — 2.34× the proven
//    4/7 — and the asymptotic formula there is CONJECTURAL (Farmer's θ = ∞
//    programme; Bettin–Gonek 2017: θ = ∞ ⇒ RH).
// 5. The ceiling of the NEW route is also a Fourier-support-1 wall: Alpöge–Furman
//    prove that no bandwidth-one certificate of their type exceeds p₀ ≤ 0.6818287,
//    and Lamzouri notes C_MT is optimal for his inequality (Carneiro–Chandee–
//    Littmann–Milinovich).  Beyond it lies F(α) for |α| > 1 — pair correlation
//    beyond the diagonal, i.e. Hardy–Littlewood prime-pair correlations on average —
//    the same wall as Montgomery's PCC.  Full PCC ⇒ 100% (Montgomery), not RH.
// 6. NO QED.  RH open.  No refereed bound is changed (this module touches Λ nowhere).
//
// FUNCTIONAL (Conrey 1989 Thm 2, quoted verbatim as Bui–Conrey–Young 2011 eq. (3.2)):
//   c(P,Q,R,θ) = 1 + (1/θ) ∫₀¹∫₀¹ e^{2Rv} ( Q(v)P′(u) + θQ′(v)P(u) + θR Q(v)P(u) )² du dv,
//   κ ≥ 1 − (1/R) log c,   P(0)=0, P(1)=1, Q(0)=1, Q′(v)=Q′(1−v),
//   mollifier B(s) = Σ_{n≤T^θ} μ(n) P(log(y/n)/log y) n^{−s}, V = Q(−(1/L)d/ds)ζ,
//   evaluated on σ₀ = 1/2 − R/L.  PROVEN for θ < 4/7 (μ·P coefficients, Conrey
//   1989 via Deshouillers–Iwaniec); rows with θ ≥ 4/7 are priced under the
//   conjectural extension of the same formula and are labelled as such.
//   Offline driver: scripts/levinson-conrey-kappa-theta-optimizer.mjs (alternating
//   exact least squares in P and Q + golden-section in R; 40-node Gauss–Legendre).

// ---------------------------------------------------------------------------
// Embedded evaluator (small, so assertions can re-derive κ from baked P, Q, R).
// P basis: u, then u^k − u (k ≥ 2).  Q basis: 1, then (1−2v)^{2k−1} − 1 (k ≥ 1).
// ---------------------------------------------------------------------------
function gaussLegendre01(n) {
  const x = [], w = [];
  for (let i = 0; i < n; i++) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5));
    let p0 = 1, p1 = z, dp = 1;
    for (let it = 0; it < 100; it++) {
      p0 = 1; p1 = z;
      for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
      dp = n * (z * p1 - p0) / (z * z - 1);
      const dz = p1 / dp; z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    p0 = 1; p1 = z;
    for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
    dp = n * (z * p1 - p0) / (z * z - 1);
    x.push(0.5 * (z + 1)); w.push(1 / ((1 - z * z) * dp * dp));
  }
  return { x, w };
}
const GL = gaussLegendre01(32);

export function conreyC(p, q, R, theta) {
  let I = 0;
  for (let j = 0; j < GL.x.length; j++) {
    const v = GL.x[j], t = 1 - 2 * v, wv = GL.w[j] * Math.exp(2 * R * v);
    let Q = q[0], Qp = 0;
    for (let k = 1; k < q.length; k++) { const m = 2 * k - 1; Q += q[k] * (Math.pow(t, m) - 1); Qp += q[k] * (-2 * m * Math.pow(t, m - 1)); }
    for (let i = 0; i < GL.x.length; i++) {
      const u = GL.x[i];
      let P = p[0] * u, Pp = p[0];
      for (let k = 1; k < p.length; k++) { const e = k + 1; P += p[k] * (Math.pow(u, e) - u); Pp += p[k] * (e * Math.pow(u, e - 1) - 1); }
      const F = Q * Pp + theta * Qp * P + theta * R * Q * P;
      I += GL.w[i] * wv * F * F;
    }
  }
  return 1 + I / theta;
}
export const kappaOf = (p, q, R, theta) => 1 - Math.log(conreyC(p, q, R, theta)) / R;

// ---------------------------------------------------------------------------
// Baked optima (scripts/levinson-conrey-kappa-theta-optimizer.mjs, 2026-09-22).
// ---------------------------------------------------------------------------
export const CONREY_OPTIMA = Object.freeze({
  // Levinson 1974 set-up: P = x, Q linear with free slope, θ = 1/2.  Levinson printed 0.3474.
  levinsonLinear: { theta: 0.5, R: 1.246176, p: [1], q: [1, 0.51608728], kappa: 0.3474392, proven: true },
  // Conrey 1989 at the Levinson length θ = 1/2 with optimised P, Q.  Conrey printed 0.36581.
  conreyHalf: {
    theta: 0.5, R: 1.476057,
    p: [1, 0.00002077, 0.12751372, 0.00040918, 0.00503524, 0.00043462],
    q: [1, 0.67008122, -0.25381995, 0.12620083, -0.03097313],
    kappa: 0.3658154, proven: true,
  },
  // Conrey 1989 at the proven Deshouillers–Iwaniec length θ = 4/7.  Conrey printed 0.4088.
  conrey47: {
    theta: 4 / 7, R: 1.291579,
    p: [1, 0.00003045, 0.14235393, 0.00059866, 0.00628684, 0.00063293],
    q: [1, 0.62271151, -0.17277768, 0.07358017, -0.01618434],
    kappa: 0.4089592, proven: true,
  },
  // CONJECTURAL rows: same formula, θ beyond the proven range (Farmer θ=∞ programme).
  theta1: {
    theta: 1, R: 0.799374,
    p: [1, 0.00014599, 0.21719685, 0.00283822, 0.01457442, 0.00292362],
    q: [1, 0.50348147, -0.04297195, 0.00897619, -0.00115258],
    kappa: 0.5884074, proven: false,
  },
  thetaMatchPairCorrelation: {
    theta: 1.3392, R: 0.638167,
    p: [1, 0.00031186, 0.26054211, 0.00601819, 0.0205252, 0.0060896],
    q: [1, 0.45774862, -0.02317414, 0.00321438, -0.00029858],
    kappa: 0.672489, proven: false,
  },
  theta2: {
    theta: 2, R: 0.473389,
    p: [1, 0.00081289, 0.31770486, 0.01550153, 0.02794468, 0.01523652],
    q: [1, 0.39751453, -0.01053385, 0.00081374, -0.00004659],
    kappa: 0.7702683, proven: false,
  },
});

// κ(θ) curve, one-piece Conrey functional, deg P = 8, deg Q(odd basis) = 5, R optimised.
export const KAPPA_THETA_CURVE = Object.freeze([
  { theta: 0.1, kappa: 0.049255, R: 6.0, proven: true },
  { theta: 0.25, kappa: 0.182161, R: 3.4975, proven: true },
  { theta: 1 / 3, kappa: 0.246908, R: 2.4027, proven: true },
  { theta: 0.5, kappa: 0.365816, R: 1.4761, proven: true, note: 'Levinson length; Conrey 1989 printed 0.36581' },
  { theta: 17 / 33, kappa: 0.375374, R: 1.4313, proven: true, note: 'Bettin–Chandee–Radziwiłł generic-coefficient limit 1/2+1/66' },
  { theta: 6 / 11, kappa: 0.393828, R: 1.3514, proven: true, note: 'Pratt–Robles length for the Feng piece' },
  { theta: 4 / 7, kappa: 0.408959, R: 1.2916, proven: true, note: 'Conrey 1989 (Deshouillers–Iwaniec); printed 0.4088' },
  { theta: 0.6, kappa: 0.424899, R: 1.2332, proven: false },
  { theta: 2 / 3, kappa: 0.459403, R: 1.1203, proven: false },
  { theta: 0.75, kappa: 0.497784, R: 1.0112, proven: false },
  { theta: 0.8, kappa: 0.518591, R: 0.9577, proven: false },
  { theta: 0.9, kappa: 0.555923, R: 0.8695, proven: false },
  { theta: 1.0, kappa: 0.588407, R: 0.7994, proven: false, note: 'full-length mollifier; still < 0.6725' },
  { theta: 1.1, kappa: 0.616889, R: 0.7419, proven: false },
  { theta: 1.2, kappa: 0.64204, R: 0.6938, proven: false },
  { theta: 1.3, kappa: 0.664393, R: 0.6527, proven: false },
  { theta: 1.4, kappa: 0.684379, R: 0.6171, proven: false },
  { theta: 1.5, kappa: 0.702345, R: 0.586, proven: false },
  { theta: 2.0, kappa: 0.770268, R: 0.4734, proven: false },
  { theta: 3.0, kappa: 0.846528, R: 0.3513, proven: false },
]);

export const KAPPA_THETA_THRESHOLDS = Object.freeze({
  // θ required for the one-piece Conrey functional to reach a target κ (bisection, deg 6/4).
  reach_0_45: 0.6478,
  reach_0_50: 0.7552,
  reach_0_60: 1.0392,
  reach_pairCorrelationRecord_0_6725007: 1.3393,
  reach_bandwidthOneCeiling_0_6818287: 1.3866,
  reach_0_75: 1.8258,
  reach_0_90: 4.4647,
  slopeAt47: 0.5707, // dκ/dθ at θ = 4/7 (central difference, h = 0.005)
});

export const SHAPE_SATURATION = Object.freeze({
  // Joint P, Q optimisation at fixed θ: enlarging the polynomial degrees changes κ below 1e-5.
  at47: [
    { degP: 5, degQodd: 3, kappa: 0.408953 },
    { degP: 8, degQodd: 5, kappa: 0.408959 },
    { degP: 12, degQodd: 8, kappa: 0.408959 },
  ],
  atHalf: [
    { degP: 1, degQodd: 1, kappa: 0.347439, note: 'Levinson 1974 printed 0.3474' },
    { degP: 5, degQodd: 3, kappa: 0.365796 },
    { degP: 8, degQodd: 5, kappa: 0.365816, note: 'Conrey 1989 printed 0.36581' },
  ],
  at1: [
    { degP: 4, degQodd: 2, kappa: 0.5883901 },
    { degP: 6, degQodd: 4, kappa: 0.5884074 },
    { degP: 10, degQodd: 7, kappa: 0.5884074 },
  ],
});

// ---------------------------------------------------------------------------
// Literature ledger (transcribed 2026-09-22 from the cited texts).
// ---------------------------------------------------------------------------
export const SOTA_LEDGER = Object.freeze([
  { year: 1974, who: 'Levinson', kappa: 0.3474, theta: '1/2 − ε', mechanism: 'Speiser/Levinson–Montgomery: zeros of ζ on the line ⇔ zeros of ζ′ left of the line; Littlewood lemma on the mollified second moment of ζ + ζ′/L with B = Σ μ(n)(log(y/n)/log y) n^{−s}.', gainFrom: 'method creation', cite: 'Adv. Math. 13 (1974) 383–436' },
  { year: 1979, who: 'Heath-Brown', kappa: 0.3474, theta: '1/2 − ε', mechanism: 'Levinson\'s zeros are simple (κ* ≥ 1/3).', cite: 'HB79' },
  { year: 1989, who: 'Conrey (θ = 1/2)', kappa: 0.36581, theta: '1/2 − ε', mechanism: 'General Q(−(1/L)d/ds)ζ with Q′(x)=Q′(1−x) and mollifier polynomial P; optimal P in closed form.', gainFrom: 'shape optimisation: +0.0184', cite: 'J. reine angew. Math. 399 (1989) 1–26' },
  { year: 1989, who: 'Conrey (θ = 4/7)', kappa: 0.4088, theta: '4/7 − ε', mechanism: 'Twisted second moment asymptotic for μ·P coefficients to length T^{4/7} via Deshouillers–Iwaniec bounds for sums of Kloosterman sums (Balasubramanian–Conrey–Heath-Brown had 9/17).', gainFrom: 'mollifier LENGTH: +0.043', cite: 'ibid.' },
  { year: 2011, who: 'Bui–Conrey–Young', kappa: 0.4105, kappaStar: 0.4058, theta: 'θ₁ = 4/7 − ε, θ₂ = 1/2 − ε', mechanism: 'Two-piece mollifier: Conrey piece + χ(s+1/2−σ₀)·Σ μ₂(h) h^{σ₀−1/2} k^{1/2−σ₀} P₂(...)/(h^s k^{1−s}) (Lou\'s idea, made rigorous); R = 1.28, deg Q = 7, deg P₁ = 5.', gainFrom: 'new PIECE: +0.0017', cite: 'Acta Arith. 150 (2011) 35–64, arXiv:1002.4127' },
  { year: 2012, who: 'Feng', kappa: 0.4107, theta: 'θ_C = 4/7 − ε, θ_F = 3/7 − ε', mechanism: 'Second piece with Λ^{*k} convolutions (Luo–Yao). Claimed 0.4128 with θ_F = 1/2; a gap in the length argument was found (BCY, PRZZ); Pratt–Robles 2018 (arXiv:1706.04593) proved θ_F < 6/11 via Type I/II Kloosterman sums, validating 0.4128.', gainFrom: 'new PIECE: +0.0002 (proven at the time); +0.0023 once θ_F = 1/2 was validated', cite: 'J. Number Theory 132 (2012) 511–542' },
  { year: 2020, who: 'Pratt–Robles–Zaharescu–Zeindler', kappa: 0.417293962, kappaStar: 0.407511457, theta: '4/7 − ε (all pieces)', mechanism: 'Mollify the whole perturbed V(s) = Q(−(1/L)d/ds)ζ rather than ζ; Feng-type (μ ⋆ Λ^{*ℓ}) pieces with K = 3, d = 1; autocorrelation-of-ratios main terms; Vaughan/Heath-Brown identities give θ = 4/7 for the Feng piece. R = 1.3036, deg P₁ = 5 (x(1−x)^k basis), Q of degree 5 in (1−2x).', gainFrom: 'new PIECES + mollifying V: +0.0045', cite: 'Res. Math. Sci. 7 (2020) art. 2, arXiv:1802.10521 §8' },
  { year: 2025, who: 'Conrey–Farmer–Kwan–Lin–Turnage-Butterbaugh', kappa: null, theta: 'any θ > 0', mechanism: 'Calculus of variations for Q: Levinson\'s method gives κ(θ) ≥ 2θ/3 for every θ > 0 (refuting the "mollifier must be long" belief); with P = x and optimal Q_R: κ(1/2) = 0.334, κ(2/3) = 0.364. Authors expect only "modest" gain at θ = 4/7 over Conrey.', cite: 'arXiv:2508.11108' },
  { year: 2026, who: 'Alpöge–Furman (proof by Claude, Anthropic)', kappa: 2 / 3, kappaStar: 2 / 3, kappaMT: 0.6725, distinct: 0.8362, theta: 'no mollifier', mechanism: 'Montgomery 1973 pair-correlation argument with RH removed: Weil Hermitian form → finite compression; rank–trace inequality rank P₁ ≥ 2 tr P₁ + 4 tr Q′ − 4b − ‖P₁+Q′‖²_HS; Sylvester inertia counts off-line pairs; prime side = unconditional form factor on Fourier support [−1,1] (Aryan 2022; BGSTB). Montgomery–Taylor window ψ_MT = cos(√2 s)·1_{(−1/2,1/2)} gives 2 − R(ψ_MT), R = 1/2 + cot(1/√2)/√2. Bandwidth-one certificate ceiling p₀ ≤ 0.6818287. Lean 4 formalised; extends to primitive Dirichlet L (Theorem B).', gainFrom: 'DIFFERENT ROUTE: +0.255 over PRZZ', cite: 'arXiv:2608.13637 (v2 2026-08-19)' },
  { year: 2026, who: 'Lamzouri', kappa: 0.6725007, distinct: 0.83625, simpleOrOnLine: 0.88762, theta: 'no mollifier', mechanism: 'Single Hilbert-space inequality (Prop. 2.1: #simple real elements ≥ 2Σ1 − Σ K(z−s)² for conjugation-invariant multisets) + BGSTB unconditional Montgomery formula with weight w(z)=4/(4−z²), f even, supp f̂ ⊂ [−1,1]. C₀ = 3/2 − cot(1/√2)/√2, C₁ = (C₀+1)/2, C₂ = (1+2√2+2C₀)/(3+2√2). C_MT optimal for the method (Carneiro–Chandee–Littmann–Milinovich). Full PCC ⇒ 100%.', cite: 'arXiv:2609.02882 (v2 2026-09-08)' },
]);

export const MOLLIFIER_LENGTH_LIMITS = Object.freeze([
  { theta: '1/2', for: 'any Dirichlet polynomial (diagonal/"square-root" barrier)', who: 'Levinson 1974' },
  { theta: '9/17', for: 'μ·P coefficients', who: 'Balasubramanian–Conrey–Heath-Brown 1985 (Vaughan identity + Weil bound)' },
  { theta: '4/7', for: 'μ·P coefficients (and PRZZ Feng-type μ⋆Λ^{*ℓ} pieces)', who: 'Conrey 1989 (Deshouillers–Iwaniec); PRZZ 2020 Thm 4.1' },
  { theta: '17/33 = 1/2 + 1/66', for: 'ARBITRARY coefficients a_n ≪ n^ε', who: 'Bettin–Chandee–Radziwiłł 2017 (Bettin–Chandee trilinear Kloosterman)' },
  { theta: '48/95', for: 'arbitrary coefficients via DFI bilinear Kloosterman', who: 'Robles–Roy–Zaharescu' },
  { theta: '6/11', for: 'Feng piece', who: 'Pratt–Robles 2018' },
  { theta: '∞ (conjectural)', for: 'Farmer θ=∞ conjecture ⇒ κ = 1 (Farmer 1993); ⇒ RH (Bettin–Gonek 2017)', who: '—' },
]);

// ---------------------------------------------------------------------------
// Barrier, attempted contribution, verdict.
// ---------------------------------------------------------------------------
export const BARRIER = Object.freeze({
  levinsonRoute: {
    binding: 'mollifier length θ',
    evidence: [
      'shape (P, Q polynomial degree) is saturated at θ = 4/7: κ moves < 1e-5 from deg (5,3) to (12,8)',
      'dκ/dθ ≈ 0.57 at θ = 4/7, so +1/66 in θ (the whole Bettin–Chandee–Radziwiłł gain for generic coefficients) would be worth ≈ +0.0086 — roughly the entire 1989→2020 multi-piece yield (+0.0083)',
      'the θ step 1/2 → 4/7 gave +0.043; thirty-one years of new mollifier pieces gave +0.0083',
    ],
    whatBreakingItNeeds: 'an asymptotic for the twisted second moment ∫|ζ(σ₀+it)|²|Σ_{n≤T^θ} μ(n)P(·)n^{−it}|² dt at θ ∈ [4/7, 4/7+δ): the off-diagonal terms reduce (Vaughan/Heath-Brown identities on μ) to bilinear forms in Kloosterman sums S(m,±n;c) whose current bound is Deshouillers–Iwaniec\'s spectral large-sieve estimate; 4/7 is where that bound stops beating the main term. Improvement = a better bilinear Kloosterman bound in the Type-II range, or extra cancellation from the μ-structure that generic-coefficient methods (17/33) cannot see.',
    ceilingEvenIfBroken: 'θ = 1 (full length) yields one-piece κ = 0.5884 < 0.6725; matching the pair-correlation record needs θ ≈ 1.339 (T^{1.34}, 2.34× the proven length) on a CONJECTURAL formula',
  },
  pairCorrelationRoute: {
    binding: 'Fourier support 1 of Montgomery\'s form factor F(α) (Rudnick–Sarnak range X^k ≤ T^{2−ε} allows only k = 1 at X ≍ T; "higher moments add nothing")',
    ceiling: 'bandwidth-one certificate ceiling p₀ ≤ 0.6818287 (Alpöge–Furman §7.2); Montgomery–Taylor window 0.6725 is optimal for Lamzouri\'s inequality (CCLM17)',
    whatBreakingItNeeds: 'F(α) for 1 < |α| ≤ 1+δ unconditionally — pair correlation beyond the diagonal, equivalent (Goldston–Montgomery) to Hardy–Littlewood prime-pair asymptotics on average / variance of primes in short intervals. Full PCC ⇒ 100% simple on the line (Montgomery), still not RH.',
  },
  commonWall: 'Both routes stop exactly at the diagonal/square-root boundary of an arithmetic mean value (twisted second moment of ζ at length T^{4/7}; F(α) at support 1). Both "θ = ∞" and "full PCC" are strictly stronger than what any known Kloosterman/spectral input provides; θ = ∞ is strictly stronger than PCC (it implies RH itself, Bettin–Gonek).',
});

export const ATTEMPTED_CONTRIBUTION = Object.freeze({
  what: 'Executed the full joint (P, Q, R) optimisation of the Conrey functional across mollifier length θ ∈ [0.1, 20] (offline driver scripts/levinson-conrey-kappa-theta-optimizer.mjs; alternating exact least squares — c is a quadratic form in P for fixed Q and vice versa — plus golden-section in R; 40-node Gauss–Legendre).',
  reproduced: 'Levinson 0.3474 (linear Q, θ=1/2) → 0.3474392; Conrey θ=1/2 0.36581 → 0.3658154; Conrey θ=4/7 0.4088 → 0.4089592 (Conrey\'s printed value used lower-degree polynomials; the fully optimised one-piece value is 0.40896, a 1.6e-4 uplift that changes nothing).',
  newQuantitativeFacts: [
    'one-piece shape saturation at 4/7 to 6e-6 (returns from P, Q degree are exhausted; CFKLT\'s variational Q therefore cannot add materially at 4/7, confirming their own expectation of a "modest" gain)',
    'dκ/dθ ≈ 0.571 at 4/7; θ needed for κ = 0.45: 0.648; for 0.50: 0.755; for 0.60: 1.039; for 0.6725: 1.339; for 0.6818: 1.387; for 0.90: 4.46',
    'κ(θ) → 1 slowly (0.9511 at θ = 8, 0.9657 at θ = 20), consistent with Farmer\'s θ = ∞ ⇒ 100%',
  ],
  subLemmaWorthProving: {
    statement: 'TWISTED-MOMENT LENGTH EXTENSION. For B(s) = Σ_{n≤y} μ(n)P(log(y/n)/log y) n^{−s}, y = T^θ, and σ₀ = 1/2 − R/log T, prove ∫₁^T |Q(−(1/L)d/ds)ζ · B|²(σ₀+it) dt = c(P,Q,R,θ)·T·(1+o(1)) for some θ ∈ (4/7, 4/7 + δ], δ > 0.',
    payoff: 'κ ≥ 0.40896 + 0.57δ from the one-piece functional alone (e.g. δ = 1/66 → +0.0086), and the same δ transfers to every PRZZ piece.',
    requiredEstimate: 'the off-diagonal Type-II bilinear form Σ_c Σ_{m~M} Σ_{n~N} a_m b_n S(m,±n;c) e(·)/c with MN ≍ y² = T^{2θ} must be o(T) for 2θ > 8/7, i.e. a power saving beyond Deshouillers–Iwaniec in the range where their spectral bound is currently sharp.',
    honestOdds: 'unchanged since 1989 for μ-coefficients; generic coefficients moved 1/2 → 17/33 (2017) only via a new trilinear Kloosterman bound. Not a focused-effort target.',
  },
  whatItDoesNotDo: 'No new theorem. No movement of any record. The θ ≥ 4/7 rows are prices under an UNPROVED extension of the formula, not bounds.',
});

export const VERDICT = Object.freeze({
  headline: 'The Levinson/mollifier κ-race is DOMINATED as of 2026-08: the unconditional record is 0.6725 (simple AND on the line) by an RH-free pair-correlation argument (Alpöge–Furman, Lean-verified; Lamzouri independent), against 0.4173 for the best mollifier. No provable mollifier length (≤ 4/7 for μ-type, 17/33 generic) — nor even the full length θ = 1 — lets the one-piece Levinson functional reach 0.6725.',
  reachableByFocusedEffort: 'NO for the record. Levinson-side: extending θ past 4/7 for μ-coefficients has been stuck 37 years and its full payoff is ~+0.01; multi-piece crossing (PRZZ open problem 4) is a "painful calculation" worth < +0.005. Pair-correlation side: the 0.6725 → 0.6818 bandwidth-one gap (+0.009) may be closable by a sharper certificate but is bounded above by 0.6818 unconditionally.',
  multiYearProgram: 'YES for anything past 0.6818: it requires Montgomery\'s form factor beyond Fourier support 1, i.e. Hardy–Littlewood prime-pair correlations on average — the same wall that blocks PCC and, by Goldston–Montgomery, the variance of primes in short intervals.',
  highestValueSubProblem: 'F(α) for α ∈ (1, 1+δ] unconditionally (even a non-trivial one-sided bound) — it lifts the simple-on-line proportion, the distinct proportion, and every downstream pair-correlation application at once; the Levinson length-extension lemma above is second and its ceiling is lower.',
  oddsShortTerm: { levinsonThetaPast47: '< 5%', pairCorrelationBeyondSupport1: '~1%', closingBandwidthOneGap0_6725_to_0_6818: '~25% (small prize)' },
  status: 'literature-verified audit + executed optimisation; NO QED; RH open; PT Λ ≤ 0.2 untouched',
});

export const SOURCES = Object.freeze([
  'N. Levinson, Adv. Math. 13 (1974) 383–436',
  'J. B. Conrey, J. reine angew. Math. 399 (1989) 1–26 (Thm 2 = the functional used here)',
  'H. M. Bui, B. Conrey, M. P. Young, Acta Arith. 150 (2011) 35–64, arXiv:1002.4127 (eq. (3.2), Thm 2.1, §2.2 numerics)',
  'S. Feng, J. Number Theory 132 (2012) 511–542',
  'K. Pratt, N. Robles, arXiv:1706.04593 (θ_F < 6/11)',
  'S. Bettin, V. Chandee, M. Radziwiłł, twisted second moments, θ < 17/33',
  'S. Bettin, S. Gonek, Mathematika 63 (2017) 29–33 (θ = ∞ ⇒ RH)',
  'K. Pratt, N. Robles, A. Zaharescu, D. Zeindler, Res. Math. Sci. 7 (2020) art. 2, arXiv:1802.10521 (§1, §8, §9)',
  'J. B. Conrey, D. W. Farmer, C.-H. Kwan, Y. Lin, C. L. Turnage-Butterbaugh, arXiv:2508.11108 (short mollifiers; Thm 1, §6 table, §7 problems)',
  'S. Baluyot, D. A. Goldston, A. I. Suriajaya, C. L. Turnage-Butterbaugh, arXiv:2501.14545 (unconditional Montgomery form factor)',
  'D. A. Goldston, A. I. Suriajaya, arXiv:2511.20059, arXiv:2603.28104 (expository: RH-removal from Montgomery)',
  'L. Alpöge, R. Furman (proof discovered by Claude, Anthropic), arXiv:2608.13637 v2 (2026-08-19), Lean 4',
  'Y. Lamzouri, arXiv:2609.02882 v2 (2026-09-08)',
  'J. B. Conrey, H. Iwaniec, K. Soundararajan, critical zeros of Dirichlet L-functions (asymptotic large sieve): 56% / 58.65% simple critical zeros in the q-family; later 61.07% on the line (Feng mollifier)',
]);

export const LEVINSON_MOLLIFIER_FRONTIER = Object.freeze({
  id: 'levinson-mollifier-frontier-audit-2026-09',
  date: '2026-09-22',
  CONREY_OPTIMA, KAPPA_THETA_CURVE, KAPPA_THETA_THRESHOLDS, SHAPE_SATURATION,
  SOTA_LEDGER, MOLLIFIER_LENGTH_LIMITS, BARRIER, ATTEMPTED_CONTRIBUTION, VERDICT, SOURCES,
});

// ---------------------------------------------------------------------------
// Assertions (harness calls a.holds()).
// ---------------------------------------------------------------------------
const PAIR_CORR_C0 = 1.5 - Math.cos(1 / Math.SQRT2) / Math.sin(1 / Math.SQRT2) / Math.SQRT2;
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const kap = (o) => kappaOf(o.p, o.q, o.R, o.theta);

export const LEVINSON_MOLLIFIER_FRONTIER_ASSERTIONS = Object.freeze([
  {
    name: 'Levinson 1974 reproduced from the Conrey functional: P=x, linear Q, θ=1/2 gives κ = 0.3474 (printed) and matches the baked 0.3474392',
    holds: () => { const k = kap(CONREY_OPTIMA.levinsonLinear); return near(k, 0.3474392, 2e-6) && k >= 0.3474; },
  },
  {
    name: 'Conrey 1989 at θ=1/2 reproduced: baked (P,Q,R) give κ = 0.3658154, within 2e-5 of the printed 0.36581',
    holds: () => { const k = kap(CONREY_OPTIMA.conreyHalf); return near(k, 0.3658154, 2e-6) && near(k, 0.36581, 2e-5); },
  },
  {
    name: 'Conrey 1989 at θ=4/7 reproduced: baked (P,Q,R) give κ = 0.4089592 ≥ printed 0.4088 and < 5/12 (PRZZ record needs extra pieces)',
    holds: () => { const k = kap(CONREY_OPTIMA.conrey47); return near(k, 0.4089592, 2e-6) && k >= 0.4088 && k < 5 / 12; },
  },
  {
    name: 'baked 4/7 optimum is locally optimal in Q (perturbing the leading Q coefficient by ±0.02 lowers κ) — shape lever is exhausted',
    holds: () => {
      const o = CONREY_OPTIMA.conrey47, k0 = kap(o);
      const up = kappaOf(o.p, o.q.map((x, i) => (i === 1 ? x + 0.02 : x)), o.R, o.theta);
      const dn = kappaOf(o.p, o.q.map((x, i) => (i === 1 ? x - 0.02 : x)), o.R, o.theta);
      return up < k0 && dn < k0;
    },
  },
  {
    name: 'shape saturation literals: at θ=4/7, deg (5,3) → (12,8) moves κ by < 1e-5; at θ=1 likewise',
    holds: () => {
      const s = SHAPE_SATURATION;
      return Math.abs(s.at47[2].kappa - s.at47[0].kappa) < 1e-5 && Math.abs(s.at1[2].kappa - s.at1[0].kappa) < 2e-5;
    },
  },
  {
    name: 'θ step 1/2 → 4/7 (+0.043) outweighs all multi-piece gains 1989 → 2020 (+0.0083)',
    holds: () => {
      const lengthGain = CONREY_OPTIMA.conrey47.kappa - CONREY_OPTIMA.conreyHalf.kappa;
      const pieceGain = 0.417293962 - CONREY_OPTIMA.conrey47.kappa;
      return lengthGain > 0.04 && pieceGain > 0.008 && pieceGain < 0.0085 && lengthGain > 5 * pieceGain;
    },
  },
  {
    name: 'κ(θ) curve is strictly increasing in θ and every entry is < 1; proven rows stop at θ = 4/7',
    holds: () => KAPPA_THETA_CURVE.every((r, i) => r.kappa < 1 && (i === 0 || r.kappa > KAPPA_THETA_CURVE[i - 1].kappa))
      && KAPPA_THETA_CURVE.every((r) => (r.proven ? r.theta <= 4 / 7 + 1e-12 : r.theta > 4 / 7)),
  },
  {
    name: 'full-length mollifier θ=1 (conjectural formula) still falls short of the pair-correlation record: 0.5884 < 0.6725007',
    holds: () => { const k = kap(CONREY_OPTIMA.theta1); return near(k, 0.5884074, 2e-6) && k < PAIR_CORR_C0; },
  },
  {
    name: 'θ ≈ 1.339 is where the one-piece Levinson functional would match 0.6725 (baked row re-evaluates to 0.67249 ± 1e-4)',
    holds: () => near(kap(CONREY_OPTIMA.thetaMatchPairCorrelation), PAIR_CORR_C0, 1e-4)
      && near(KAPPA_THETA_THRESHOLDS.reach_pairCorrelationRecord_0_6725007, 1.3393, 1e-3),
  },
  {
    name: 'Montgomery–Taylor constants agree across Alpöge–Furman (2 − R(ψ_MT)) and Lamzouri (C₀, C₁, C₂)',
    holds: () => {
      const R = 0.5 + Math.cos(1 / Math.SQRT2) / Math.sin(1 / Math.SQRT2) / Math.SQRT2;
      const C1 = (PAIR_CORR_C0 + 1) / 2, C2 = (1 + 2 * Math.SQRT2 + 2 * PAIR_CORR_C0) / (3 + 2 * Math.SQRT2);
      return near(2 - R, PAIR_CORR_C0, 1e-12) && near(PAIR_CORR_C0, 0.6725007, 1e-6) && near(R, 1.3275, 1e-4)
        && near(C1, 0.83625, 1e-5) && near(C2, 0.88762, 1e-5) && PAIR_CORR_C0 > 2 / 3 && PAIR_CORR_C0 < 0.6818287;
    },
  },
  {
    name: 'record ledger: PRZZ κ = 0.417293962 > 5/12 ≥ κ* = 0.407511457, and the 2026 pair-correlation record (2/3; 0.6725 windowed) exceeds it by 0.249 / 0.255',
    holds: () => 0.417293962 > 5 / 12 && 0.407511457 < 5 / 12 && near(2 / 3 - 0.417293962, 0.2494, 1e-3)
      && PAIR_CORR_C0 - 0.417293962 > 0.25
      && SOTA_LEDGER.filter((r) => r.year === 2026).length === 2,
  },
  {
    name: 'honest framing: no QED, RH open, conjectural rows flagged, verdict says the mollifier race is dominated',
    holds: () => /NO QED/.test(VERDICT.status) && /RH open/.test(VERDICT.status)
      && /DOMINATED/.test(VERDICT.headline) && /NO for the record/.test(VERDICT.reachableByFocusedEffort)
      && Object.values(CONREY_OPTIMA).every((o) => (o.theta < 4 / 7 + 1e-12) === o.proven)
      && /UNPROVED/.test(ATTEMPTED_CONTRIBUTION.whatItDoesNotDo),
  },
]);

export default LEVINSON_MOLLIFIER_FRONTIER;
